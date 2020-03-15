exports.data = {
  users: [
    {
      name: "user",
      username: "user0",
      password: "password"
    },
    {
      name: "user",
      username: "anotherUser",
      password: "password"
    },
    {
      name: "user",
      username: "thirdUser",
      password: "password"
    }
  ],
  gear: [
    {
      brand: "A",
      name: "A1",
      type: "Wetsuit"
    }
  ],
  club: [
    {
      name: "A",
      location: "A1",
      description: "Club",
      website: "example.com"
    },
    {
      name: "B",
      location: "A1",
      description: "Another club",
      website: "example2.com"
    }
  ],
  group: [
    {
      group_name: "Group",
      text: "Content"
    }
  ],
  message: [
    {
      text: "Another message"
    }
  ],
  dive: [
    {
      time_in: 1533114000000,
      time_out: 1533115500000,
      safety_stop_time: 3,
      bottom_time: 21,
      max_depth: 17.5,
      description: "Fun times",
      is_public: true
    }
  ]
};

exports.before = async () => {
  // Chai setup
  const chai = require("chai");
  const chaiHttp = require("chai-http");
  chai.use(chaiHttp);
  const { request, expect } = chai;

  // App and data
  const app = require("../src/app");
  const { users } = exports.data;

  let tokens = [],
    user_ids = [];

  await request(app)
    .post("/user")
    .send(users[0])
    .then(res => {
      expect(res.status).equal(200);
      expect(res).be.an("object");
      user_ids.push(res.body._id);
    });

  await request(app)
    .post("/user")
    .send(users[1])
    .then(res => {
      expect(res.status).equal(200);
      expect(res).be.an("object");
      user_ids.push(res.body._id);
    });

  await request(app)
    .post("/user")
    .send(users[2])
    .then(res => {
      expect(res.status).equal(200);
      expect(res).be.an("object");
      user_ids.push(res.body._id);
    });

  await request(app)
    .post("/user/login")
    .send(users[0])
    .then(res => {
      expect(res.status).equal(200);
      expect(res).be.an("object");
      tokens.push(res.body.token);
    });

  await request(app)
    .post("/user/login")
    .send(users[1])
    .then(res => {
      expect(res.status).equal(200);
      expect(res).be.an("object");
      tokens.push(res.body.token);
    });

  await request(app)
    .post("/user/login")
    .send(users[2])
    .then(res => {
      expect(res.status).equal(200);
      expect(res).be.an("object");
      tokens.push(res.body.token);
    });

  return { tokens: tokens, user_ids: user_ids };
};

exports.after = async tokens => {
  // Chai setup
  const chai = require("chai");
  const chaiHttp = require("chai-http");
  chai.use(chaiHttp);
  const { request, expect } = chai;

  // App
  const app = require("../src/app");

  await request(app)
    .delete("/user")
    .set({ Authorization: `Bearer ${tokens[0]}` })
    .then(res => {
      expect(res.status).equal(200);
      expect(res).be.an("object");
    });

  await request(app)
    .delete("/user")
    .set({ Authorization: `Bearer ${tokens[1]}` })
    .then(res => {
      expect(res.status).equal(200);
      expect(res).be.an("object");
    });

  await request(app)
    .delete("/user")
    .set({ Authorization: `Bearer ${tokens[2]}` })
    .then(res => {
      expect(res.status).equal(200);
      expect(res).be.an("object");
    });
};