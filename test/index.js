var should = require('should')
var mongo2es = require('../index').convert

describe('When passed in a mongo query', function() {
    
    it('should convert it to an ES query - basic query', function() {
        var q = {name: "George"}
        mongo2es(q).should.deepEqual({
            query: {
                bool: {
                    must: [
                        {match: {name: "George"}}
                    ]
                }
            }
        })
    })
    
    it('should convert it to an ES query - basic query >1 props', function() {
        var q = {name: "George", flag: true}
        mongo2es(q).should.deepEqual({
            query: {
                bool: {
                    must: [
                        {match: {name: "George"}},
                        {match: {flag: true}}
                    ]
                }
            }
        })
    })
    
    it('should convert it to an ES query - basic $and query', function() {
        var q = {$and:[{name: "George"}, {lastname: "Greg"}]}
        mongo2es(q).should.deepEqual({
            query: {
                bool: {
                    must: [
                        {match: {name: "George"}},
                        {match: {lastname: "Greg"}}
                    ]
                }
            }
        })
    })
    
    it('should convert it to an ES query - basic $or query', function() {
        var q = {$or:[{name: "George"}, {lastname: "Greg"}]}
        mongo2es(q).should.deepEqual({
            query: {
                bool: {
                    should: [
                        {match: {name: "George"}},
                        {match: {lastname: "Greg"}}
                    ]
                }
            }
        })
    })
    
    it('should convert it to an ES query - complex $and/$or query', function() {
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
        mongo2es(q).should.deepEqual({
            query: {
                bool: {
                    must: [
                        {
                            bool: {
                                must: [
                                     {match: {name: "George"}},
                                     {match: {lastname: "Greg"}}
                                ]
                            }
                        },
                        {
                            bool: {
                                should: [
                                    {match: {name: 1}},
                                    {match: {lastname: true}}
                                ]
                            }
                        }
                    ]
                }
            }
        })
    })
    
    it('should convert it to an ES query - query into a subfield', function() {
        var q = {"name.lastname": "George"}
        mongo2es(q).should.deepEqual({
            query: {
                bool: {
                    must: [
                        {match: {"name.lastname": "George"}}
                    ]
                }
            }
        })
    })
    
    it('should convert it to an ES query - a complex query', function() {
        var q = {
            "$or": [
                {
                    "name": "BRAF V600E",
                    "exclude": false
                },
                {
                    "GRCh37_location.compositeKey": "827ded099a8adce3b2f8dad94a6e1140"
                }
            ]
        }
        mongo2es(q).should.deepEqual({
            query: {
                bool: {
                    should: [
                        {
                            bool: {
                                must: [
                                    {match: {"name": "BRAF V600E"}},
                                    {match: {"exclude": false}}
                                ]
                            }
                        },
                        {
                            bool: {
                                must: [
                                    {match: {"GRCh37_location.compositeKey": "827ded099a8adce3b2f8dad94a6e1140"}}
                                ]
                            }
                        }
                    ]
                }
            }
        })
    })
    
    it('should convert it to an ES query - a complex query', function() {
        var q = {
            "$and": [
                {
                    "GRCh37_location.compositeKey": "d0c49705b1a4a882f842d69b715f5c26"
                },
                {
                    "GRCh37_location.transcript_consequences.transcript": "ENST00000417037.2"
                }
            ]
        }
        mongo2es(q).should.deepEqual({
            query: {
                bool: {
                    must: [
                        {match: {"GRCh37_location.compositeKey": "d0c49705b1a4a882f842d69b715f5c26"}},
                        {match: {"GRCh37_location.transcript_consequences.transcript": "ENST00000417037.2"}}
                    ]
                }
            }
        })
    })
    
    it('should convert it to an ES query - a complex query w/ $in', function() {
        var q = {
            "$and": [
                {
                    "txSites": {
                        "$in": ["NM_001025366.2:262", "Another one"]
                    }
                },
                {
                    "$or": [
                        {"mutation_type": "domain"},
                        {"mutation_type": "hotspot"}
                    ]
                }
            ]
        }
        mongo2es(q).should.deepEqual({
            query: {
                bool: {
                    must: [
                        {
                            bool: {
                                should: [
                                    {match: {txSites: "NM_001025366.2:262"}},
                                    {match: {txSites: "Another one"}}
                                ]
                            }
                        },
                        {
                            bool: {
                                should: [
                                    {match: {mutation_type: "domain"}},
                                    {match: {mutation_type: "hotspot"}}
                                ]
                            }
                        }
                    ]
                }
            }
        })
    })


})