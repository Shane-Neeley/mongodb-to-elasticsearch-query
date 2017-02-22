/**
 * Convert a mongodb query into an ES query.
 *
 * @param  {Object} q - the mongodb query
 * @return {Object} the ES query
 */



module.exports = {

    // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-filter-context.html
    // maybe track the levels of the query for depth
    // iterate over the depth
    convert: function(q) {
        var es = {query: {}}
        return es
    }
};