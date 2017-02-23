var _ = require('underscore')

module.exports = {

    /**
     * Convert a mongodb query into an ES query
     * @param  {Object} q - the mongodb query
     * @return {Object} the ES query
     */
    // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-filter-context.html
    convert: function(q) {
        var es = {
            query: {
                bool: {
                    must: [],
                    should: []
                }
            }
        }

        // http://stackoverflow.com/questions/15690706/recursively-looping-through-an-object-to-build-a-property-list
        // recursively find the properties of this object
        function iterate(obj, stack) {
            for (var property in obj) {
                if (obj.hasOwnProperty(property)) {
                    if (typeof obj[property] == "object") {
                        iterate(obj[property], stack + '---' + property);
                    }
                    else {
                        props.push(stack + '---' + property)
                    }
                }
            }
        }

        var props = []
        iterate(q, '')
        props = _.map(props, function(p){
            return p.slice(3) // remove the first ---
        })
        _.each(props, function(propStr) {
            var subs = propStr.split('---')
            if (!_.contains(subs, "$and") && !_.contains(subs, "$or")) {
                _.each(subs, function(f) {
                    // if doesn't have a $ field, make straight musts
                    var termQ = {term:{}}
                    termQ.term[f] = q[f]
                    es.query.bool.must.push(termQ)
                })
            }
        })
        if (q.$and) {
            _.each(q.$and, function(tq) {
                es.query.bool.must.push({term: tq})
            })
        }
        if (q.$or) {
            _.each(q.$or, function(tq) {
                es.query.bool.should.push({term: tq})
            })
        }
        if (_.isEmpty(es.query.bool.must)) delete es.query.bool.must
        if (_.isEmpty(es.query.bool.should)) delete es.query.bool.should

        return es
    }

};