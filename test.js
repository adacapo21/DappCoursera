let Ballot = artifacts.require("./Ballot.sol");

let ballotInstance;

contract('Ballot Contract', function (accounts) {
  //accounts[0] is the default account
  //Positive Test 1 
  it("Contract deployment", function() {
    return Ballot.deployed().then(function (instance) {
      ballotInstance = instance;
      assert(ballotInstance !== undefined, 'Ballot contract should be defined');
    });
  });

  //Positive Test 2
  it("Valid user registration", function() {
    return ballotInstance.register(accounts[1], { from: accounts[0]}).then(function (result) {
      assert.equal('0x01', result.receipt.status, 'Registration is valid');
      return ballotInstance.register(accounts[2], { from: accounts[0]});
    }).then(function (result) {
      assert.equal('0x01', result.receipt.status, 'Registration is valid');
      return ballotInstance.register(accounts[3], { from: accounts[0]});
    }).then(function(result) {
      assert.equal('0x01', result.receipt.status, 'Registration is valid');
    });
  });

  //Positive Test 3
  it("Valid voting", function() {
    return ballotInstance.vote(2, {from: accounts[0]}).then(function (result) {
      assert.equal('0x01', result.receipt.status, 'Voting is done');
      return ballotInstance.vote(1, {from: accounts[1]});
    }).then(function (result) {
      assert.equal('0x01', result.receipt.status, 'Voting is done');
      return ballotInstance.vote(1, {from: accounts[2]});
    }).then(function (result) {
      assert.equal('0x01', result.receipt.status, 'Voting is done');
      return ballotInstance.vote(1, {from: accounts[3]});
    }).then(function (result) {
      assert.equal('0x01', result.receipt.status, 'Voting is done');
    });
  });

  //Positive Test 4
  it("Validate winner", function () {
    return ballotInstance.winningProposal.call().then(function (result) {
      assert.equal(1, result.toNumber(), 'Winner is validated with the expected winner');
    });
  });

  //Negative Test 5
  it("Should NOT accept unauthorized registration", function () {
    return ballotInstance.register(accounts[6], { from: accounts[1]})
	.then(function (result) {
		/* 	If the user had handled the above mentioned failure case in solidity,
			then this block will not be executed.
			Truffle would directly throw the revert error which will be catched
		*/
		throw("Condition not implemented in Smart Contract");
    }).catch(function (e) {
		/*	If the error is custom thrown then the condition was not checked and hence fail the test case
			else pass the test case
		*/
		if(e === "Condition not implemented in Smart Contract") {
			assert(false);
		} else {
			assert(true);
		}
	})
  });

  //Negative Test 6
  it("Should NOT accept unregistered user vote", function () {
    return ballotInstance.vote(1, {from: accounts[7]})
		.then(function (result) {
				throw("Condition not implemented in Smart Contract");
    }).catch(function (e) {
		if(e === "Condition not implemented in Smart Contract") {
			assert(false);
		} else {
			assert(true);
		}
	})
  });
});
