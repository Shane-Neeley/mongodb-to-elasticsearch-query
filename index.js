var _ = require('underscore')

module.exports = {

    /**
     * Convert a mongodb query into an ES query
     * @param  {Object} q - the mongodb query
     * @return {Object} the ES query
     */
    // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-filter-context.html
    convert: function(q) {

        console.log('query')
        console.log(JSON.stringify(q))

        var es = {
            query: {
                bool: {
                    must: [],
                    should: []
                }
            }
        }

        // http://stackoverflow.com/questions/15690706/recursively-looping-through-an-object-to-build-a-property-list
        // recursively list the properties of this object
        function iterate(obj, stack) {
            for (var property in obj) {
                if (obj.hasOwnProperty(property)) {
                    if (typeof obj[property] == "object") {
                        iterate(obj[property], stack + ',' + property);
                    }
                    else {
                        props.push(stack + ',' + property)
                    }
                }
            }
        }


        var props = []
        iterate(q, '')
        props = _.map(props, function(p){
            return p.slice(1) // remove the first ","
        })

        console.log('props')
        console.log(props)


        _.each(props, function(propStr) {
            var subs = propStr.split(',')
            if (!_.contains(subs, "$and") && !_.contains(subs, "$or")) {
                _.each(subs, function(f) {
                    // if doesn't have a $ field, make straight musts
                    var mq = {match:{}}
                    mq.match[f] = q[f]
                    es.query.bool.must.push(mq)
                })
            }
        })


        var boolMust = {bool:{must:[]}}
        var boolShould = {bool:{should:[]}}
        var deepCopy = function(obj) {return JSON.parse(JSON.stringify(obj))}

        if (q.$and) {
            _.each(q.$and, function(mq) {
                var b = deepCopy(boolMust)
                b.must.push({match: mq})
                es.query.bool.must.push(b)
            })
        }
        if (q.$or) {
            _.each(q.$or, function(mq) {
                var b = deepCopy(boolShould)
                b.must.push({match: mq})
                es.query.bool.must.push(b)
            })
        }
        if (_.isEmpty(es.query.bool.must)) delete es.query.bool.must
        if (_.isEmpty(es.query.bool.should)) delete es.query.bool.should

        console.log('result')
        console.log(JSON.stringify(es))

        return es
    }

};