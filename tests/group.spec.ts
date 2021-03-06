import { seeder } from "@btdrawer/divelog-server-core";
import { Express } from "express";
import { get } from "lodash";
import chai from "chai";
import chaiHttp from "chai-http";
import AppWrapper from "../src/AppWrapper";

chai.use(chaiHttp);
const { request, expect } = chai;
const { seedDatabase, groups, users } = seeder;

let app: Express;

describe("Group", () => {
    before(async () => {
        const wrapper = await AppWrapper.init();
        app = wrapper.app;
    });

    beforeEach(
        seedDatabase({
            groups: true
        })
    );

    describe("Create group", () => {
        it("should create new group", () =>
            request(app)
                .post("/group")
                .set({ Authorization: `Bearer ${users[0].token}` })
                .send({
                    group_name: "New group",
                    participants: [get(users[1], "output.id")],
                    text: "Hi"
                })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");
                    expect(res.body.name).equal("New group");
                    expect(res.body.participants).have.length(2);
                    expect(res.body.participants[0].toString()).equal(
                        get(users[1], "output.id")
                    );
                    expect(res.body.participants[1].toString()).equal(
                        get(users[0], "output.id")
                    );
                    expect(res.body.messages[0].text).equal(
                        get(groups[0], "output.messages[0].text")
                    );
                    expect(res.body.messages[0].sender).equal(
                        get(groups[0], "output.messages[0].sender").toString()
                    );
                }));
    });

    describe("Send message", () => {
        it("should send message", () =>
            request(app)
                .post(`/group/${get(groups[0], "output.id")}/message`)
                .set({ Authorization: `Bearer ${users[0].token}` })
                .send({
                    text: "Hi"
                })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");
                    expect(res.body.messages[1].text).equal("Hi");
                    expect(res.body.messages[1].sender).equal(
                        get(users[0], "output.id")
                    );
                }));
    });

    describe("Add member to group", () => {
        it("should add member to group", () =>
            request(app)
                .post(
                    `/group/${get(groups[0], "output.id")}/user/${get(
                        users[2],
                        "output.id"
                    )}`
                )
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");
                    expect(res.body.participants).have.length(3);
                    expect(res.body.participants[2].toString()).equal(
                        get(users[2], "output.id")
                    );
                }));
    });

    describe("List groups", () => {
        it("should list groups the user is a participant in", () =>
            request(app)
                .get("/group")
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body.data).be.an("array");
                    expect(res.body.data).have.length(2);
                    expect(res.body.data[0]._id).equal(
                        get(groups[0], "output.id")
                    );
                    expect(res.body.data[1]._id).equal(
                        get(groups[2], "output.id")
                    );
                }));

        it("should limit results", () =>
            request(app)
                .get("/group")
                .query({ limit: 1 })
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body.data).be.an("array");
                    expect(res.body.data).have.length(1);
                    expect(res.body.pageInfo.hasNextPage).equal(true);
                }));
    });

    describe("Get group", () => {
        it("should get group", () =>
            request(app)
                .get(`/group/${get(groups[0], "output.id")}`)
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");
                    expect(res.body._id).equal(get(groups[0], "output.id"));
                    expect(res.body.name).equal(get(groups[0], "output.name"));
                    expect(res.body.participants).have.length(2);
                    expect(res.body.messages).have.length(1);
                    expect(res.body.messages[0].text).equal(
                        get(groups[0], "output.messages[0].text")
                    );
                    expect(res.body.messages[0].sender).equal(
                        get(users[0], "output.id")
                    );
                }));
    });

    describe("Leave group", () => {
        it("should leave group", () =>
            request(app)
                .delete(`/group/${get(groups[0], "output.id")}/leave`)
                .set({ Authorization: `Bearer ${users[1].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");
                    expect(res.body.participants).have.length(1);
                }));
    });
});
