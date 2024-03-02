const request = require('supertest');
const app = require('./routes/auth');

describe('GET /getAllUsers', function() {
    this.timeout(500000);
    it('should get all employees', function (done) {
        setTimeout(function() {
            request(app)
            .get('/getAllUsers')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);      
              done();
            });
            done();
        }, 300000);
        });
    });



