describe('marionette/drivers/moz-tcp', function() {

  try {
    if (typeof(window.navigator.mozTCPSocket) === 'undefined') {
      return;
    }
  } catch(e) {
    return;
  }

  var Abstract,
      Driver,
      CommandStream;

  cross.require('command-stream', function(obj) {
    CommandStream = obj;
  });

  cross.require('drivers/abstract', function(obj) {
    Abstract = obj;
  });

  cross.require('drivers/moz-tcp', function(obj) {
    Driver = obj;
  });

  var subject,
      RealSocket,
      sockets = [];

  before(function() {
    RealSocket = Driver.Socket;
    Driver.Socket = FakeSocket;
    FakeSocket.sockets = sockets;
  });

  after(function() {
    Driver.Socket = RealSocket;
  });

  function connect() {
    beforeEach(function() {
      subject.connect(function() {
        done();
      });
    });
  }

  beforeEach(function() {
    subject = new Driver();
  });

  describe('._sendCommand', function() {
    var sent = [];

    beforeEach(function() {
      subject._connect();
      subject.client.send = function() {
        sent.push(arguments);
      }
      subject.client.send({
        type: 'foo',
      });
    });

    it('should send request to socket', function() {
      expect(sent).to.eql([
        [{type: 'foo'}]
      ]);
    });

  });

  describe('client event: command', function() {
    var sent = [];

    beforeEach(function() {
      sent.length = 0;
      subject._onDeviceResponse = function() {
        sent.push(arguments);
      }
      subject._connect();
      subject.client.emit('command', { type: 'foo' });
    });

    it('should call onDeviceResponse', function() {
      expect(sent).to.eql([
        [{ id: 0, response: {type: 'foo'} }]
      ]);
    });

  });

  describe('._connect', function() {

    beforeEach(function() {
      subject._connect();
    });

    it('should create a socket for connection', function() {
      expect(sockets[0].host).to.be('127.0.0.1');
      expect(sockets[0].port).to.be(2828);
    });

  });

  describe('._close', function() {
    beforeEach(function() {
      subject._connect();
      subject.close();
    });

    it('should close socket', function() {
      expect(subject.socket.destroyed).to.be(true);
    });

  });


});


