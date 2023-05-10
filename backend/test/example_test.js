process.env.NODE_ENV = 'test';
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let server = require('../app')


chai.use(chaiHttp);
/*
* Test the /GET route
*/
describe('/GET', () => {
    it('', (done) => {
    chai.request(server)
        .get('/')
        .end((err, res) => {
                res.should.have.status(200);
            done();
        });
    });
});