import express from "express";
import { Gear, resources } from "@btdrawer/divelog-server-core";
import { getUserId, useHandlers, runListQuery } from "../utils";

const router = express.Router();

module.exports = (middleware: any, queryWithCache: any) => {
    const { authentication, clearCache } = middleware;

    // Create gear
    router.post(
        "/",
        authentication,
        clearCache,
        useHandlers(async (req: any) =>
            Gear.create({
                brand: req.body.brand,
                name: req.body.name,
                type: req.body.type,
                owner: getUserId(req)
            })
        )
    );

    // List all a user's gear
    router.get(
        "/",
        authentication,
        useHandlers((req: any) =>
            runListQuery(
                queryWithCache,
                Gear,
                {
                    owner: getUserId(req)
                },
                undefined,
                resources.GEAR
            )(req)
        )
    );

    // Get gear by ID
    router.get(
        "/:id",
        authentication,
        useHandlers((req: any) => Gear.get(req.params.id, undefined, ["owner"]))
    );

    // Update gear
    router.put(
        "/:id",
        authentication,
        clearCache,
        useHandlers((req: any) => Gear.update(req.params.id, req.body))
    );

    // Delete gear
    router.delete(
        "/:id",
        authentication,
        clearCache,
        useHandlers(async (req: any) => Gear.delete(req.params.id))
    );

    return router;
};
