var should = require('chai').should(),
    mongo2es = require('../index'),
    convert = mongo2es.convert

describe('When passed in a mongo query', function() {
    it('should convert it to an ES query', function() {
        var q = {name: "George"}
        convert(q).should.equal({});
    });
})