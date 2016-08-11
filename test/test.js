const generator = require('../lib/generator');
const assert = require('assert');
const fs = require('fs');

describe('generator tests', () => {
    it('should init without error', () => {
        generator.init({
            logEnabled: true
        });
    });

    it('should fail on wrong color', (done) => {
        generator.generate({
            color: "ehwehwthwthwth"
        }, (err) => {
            if (err) {
                done();
            } else {
                throw new Error('should fail');
            }
        });
    });

    it('should fail on wrong scale', (done) => {
        generator.generate({
            scale: "ehwehwthwthwth"
        }, (err) => {
            if (err) {
                done();
            } else {
                throw new Error('should fail');
            }
        });
    });

    it('should fail if generated file does not exist', (done) => {
        generator.generate({}, (err, filename) => {
            assert.ifError(err);
            assert.ok(fs.existsSync(filename), `${filename} does not exist`);
            done();
        });
    });
});