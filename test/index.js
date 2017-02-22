var should = require('should')
var mongo2es = require('../index').convert

describe('When passed in a mongo query', function() {

    // basic query
    it('should convert it to an ES query', function() {
        var q = {name: "George"}
        mongo2es(q).should.deepEqual({query: {}})
    })

    // basic $and query
    it('should convert it to an ES query', function() {
        var q = {$and:[{name: "George"}, {lastname: "Greg"}]}
        mongo2es(q).should.deepEqual({query: {}})
    })

    // basic $or query
    it('should convert it to an ES query', function() {
        var q = {$or:[{name: "George"}, {lastname: "Greg"}]}
        mongo2es(q).should.deepEqual({query: {}})
    })

    // complex $and/$or query
    it('should convert it to an ES query', function() {
        var q = {
            $and:[
                {name: "George"},
                {lastname: "Greg"},
                {$or:[
                    {name: 1},
                    {lastname: true}
                ]}
            ]
        }
        mongo2es(q).should.deepEqual({query: {}})
    })

    // query into a subfield
    it('should convert it to an ES query', function() {
        var q = {"name.lastname": "George"}
        mongo2es(q).should.deepEqual({query: {}})
    })

})