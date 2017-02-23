var should = require('should')
var mongo2es = require('../index').convert

describe('When passed in a mongo query', function() {

    // basic query
    it('should convert it to an ES query', function() {
        var q = {name: "George"}
        console.log(q)
        mongo2es(q).should.deepEqual({
            query: {
                bool: {
                    must: [
                        {term: {name: "George"}}
                    ]
                }
            }
        })
    })

    // basic query >1 props
    it('should convert it to an ES query', function() {
        var q = {name: "George", flag: true}
        console.log(q)
        mongo2es(q).should.deepEqual({
            query: {
                bool: {
                    must: [
                        {term: {name: "George"}},
                        {term: {flag: true}}
                    ]
                }
            }
        })
    })

    // basic $and query
    it('should convert it to an ES query', function() {
        var q = {$and:[{name: "George"}, {lastname: "Greg"}]}
        console.log(q)
        mongo2es(q).should.deepEqual({
            query: {
                bool: {
                    must: [
                        {term: {name: "George"}},
                        {term: {lastname: "Greg"}}
                    ]
                }
            }
        })
    })

    // basic $or query
    it('should convert it to an ES query', function() {
        var q = {$or:[{name: "George"}, {lastname: "Greg"}]}
        console.log(q)
        mongo2es(q).should.deepEqual({
            query: {
                bool: {
                    should: [
                        {term: {name: "George"}},
                        {term: {lastname: "Greg"}}
                    ]
                }
            }
        })
    })

    // complex $and/$or query
    xit('should convert it to an ES query', function() {
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
        console.log(q)
        mongo2es(q).should.deepEqual({
            query: {
                bool: {
                    must: [
                        {term: {name: "George"}},
                        {term: {lastname: "Greg"}}
                    ],
                    should: [
                        {term: {name: 1}},
                        {term: {lastname: true}}
                    ]
                }
            }
        })
    })

    // query into a subfield
    it('should convert it to an ES query', function() {
        var q = {"name.lastname": "George"}
        console.log(q)
        mongo2es(q).should.deepEqual({
            query: {
                bool: {
                    must: [
                        {term: {"name.lastname": "George"}}
                    ]
                }
            }
        })
    })

})