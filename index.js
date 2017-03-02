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

        // http://stackoverflow.com/questions/15690706/recursively-looping-through-an-object-to-build-a-property-list
        // recursively list the properties of this object
        var es = {
            query: {
                bool: {
                    must: [],
                    //should: []
                }
            }
        }

        es.query.bool.must.push({bool:{must:[]}})
        es.query.bool.must.push({bool:{should:[]}})
        //es.query.bool.should.push({bool:{must:[]}})
        //es.query.bool.should.push({bool:{should:[]}})

        var inAnd, inOr
        function iterate(obj) {
            for (var property in obj) {
                console.log('\n')
                // operator
                if (typeof obj[property] == "object" && (property == "$and" || obj[property].$and)) {
                    console.log('step1')
                    console.log(property)
                    console.log(obj[property])
                    inAnd = true
                    inOr = false
                    iterate(obj[property])
                }
                // operator
                else if (typeof obj[property] == "object" && (property == "$or" || obj[property].$or)) {
                    console.log('step2')
                    console.log(property)
                    console.log(obj[property])
                    inOr = true
                    inAnd = false
                    iterate(obj[property])
                }
                // non-operator (a number index)
                else if (typeof obj[property] == "object" && !obj[property].$and && !obj[property].$or) {
                    console.log('step3')
                    console.log(property)
                    console.log(obj[property])
                    if (inAnd === true) {
                        console.log('step4 pushing: ' + JSON.stringify({match: obj[property]}))
                        es.query.bool.must[0].bool.must.push({match: obj[property]})
                    }
                    if (inOr === true) {
                        console.log('step5 pushing: ' + JSON.stringify({match: obj[property]}))
                        es.query.bool.must[1].bool.should.push({match: obj[property]})
                    }
                }
            }
        }

        iterate(q)

        console.log('result')
        console.log(JSON.stringify(es))

        return es
    }

};