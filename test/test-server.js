global.DATABASE_URL = 'mongodb://localhost/shopping-list-test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Item = require('../models/item');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
	before(function(done) {
		server.runServer(function() {
			Item.create({name: 'Broad beans'},
				{name: 'Tomatoes'},
				{name: 'Peppers'}, function() {
				});
			done();
		});
	});


	it('should list items on get', function(done) {
    	chai.request(app)
    		.get('/items')
    		.end(function(err, res) {
    			should.equal(err, null);
    			res.should.have.status(200);
    			res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                res.body[0].id.should.be.a('string');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
    		});
    	done();
    });

    it('should add an item on post', function(done) {
    	chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('string');
                res.body.name.should.equal('Kale');
                storage.items.should.be.a('array');
                storage.items.should.have.length(4);
                storage.items[3].should.be.a('object');
                storage.items[3].should.have.property('_id');
                storage.items[3].should.have.property('name');
                storage.items[3].id.should.be.a('string');
                storage.items[3].name.should.be.a('string');
                storage.items[3].name.should.equal('Kale');
                console.log(storage.items);
            });
        done();
    });

    it('should not post without body data', function(done) {
    	chai.request(app)
    		.put('/items/id')
    		.send({'name': 'PutTest2'})
    		.end(function(err,res) {
    			res.body.should.have.property('name');
    			res.body.name.should.be.a('string').with.length.above(1);
    			res.body.should.have.property('_id');
    			res.should.have.status(200);
    		});
    	done();
    });

    it('should only post something in valid JSON', function(done) {
    	chai.request(app)
    		.put('/items/id')
    		.send({'name': 'PutTest3', 'id': 3})
    		.end(function(err, res) {
    			res.body.should.have.property('name');
    			res.body.name.should.be.a('string');
    			res.body.name.should.not.be.a('number');
      			res.should.have.status(200);
    		});
    	done();
    });

    it('should edit an item on put', function(done) {
    	chai.request(app)
    		.put('/items/id')
    		.send({'name': 'Bucket'})
    		.end(function(err, res) {
    			should.equal(err, null);
    			res.should.have.status(200);
    			res.should.be.json;
    			res.body.should.be.a('object');
    			res.body.should.have.property('name');
    			res.body.should.have.property('_id');
    			res.body.id.should.be.a('string');
    			res.body.name.should.be.a('string');
    			res.body.name.should.equal('Bucket');
    			storage.items.should.be.a('array');
    			storage.items.should.have.length(4);
    			storage.items[0].should.be.a('object');
    			storage.items[0].should.have.property('name');
    			storage.items[0].should.have.property('_id');
    			storage.items[0].id.should.be.a('string');
    			storage.items[0].name.should.be.a('string');
    			storage.items[0].name.should.equal('Bucket');
    		});
    	done();
	});

    it('should delete an item on delete', function(done) {
    	chai.request(app)
 			.delete('/items/id')
 			.send({'name': 'Bucket'})
    		.end(function(err, res) {
    			should.equal(err, null);
    			res.should.have.status(200);
    			res.should.be.json;
    			res.body.should.be.a('object');
    			res.body.should.have.property('name');
    			res.body.should.have.property('_id');
    			res.body.name.should.be.a('string');
    			res.body.id.should.be.a('string');
    			storage.items.should.be.a('array');
    			storage.items.should.have.length(3);
    			storage.items[0].should.be.a('object');
    			storage.items[0].should.have.property('name');
    			storage.items[0].should.have.property('_id');
    			storage.items[0].name.should.be.a('string');
    			storage.items[0].id.should.be.a('string');
    			console.log(storage.items);
    		});
    	done();
    });

    after(function(done) {
		Item.remove(function() {
		});
		done();
	});

});