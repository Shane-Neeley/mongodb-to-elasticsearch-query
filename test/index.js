var should = require('should')
var mongo2es = require('../index')
var convert = mongo2es.convert

describe('When passed in a mongo query', function() {

    // basic query
    it('should convert it to an ES query', function() {
        var q = {name: "George"}
        convert(q).should.deepEqual({query: {}})
    })

    // basic $and query
    it('should convert it to an ES query', function() {
        var q = {$and:[{name: "George"}, {lastname: "Greg"}]}
        convert(q).should.deepEqual({query: {}})
    })

    // basic $or query
    it('should convert it to an ES query', function() {
        var q = {$or:[{name: "George"}, {lastname: "Greg"}]}
        convert(q).should.deepEqual({query: {}})
    })

})