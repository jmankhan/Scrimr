import express from "express";
import { checkSchema, validationResult } from "express-validator";
import p from "@prisma/client";

const router = express.Router();
const prisma = new p.PrismaClient();

import requireAuth from "../middlewares/auth.js";
import SummonerService from "../services/summoner.service.js";

router.get("/", async (req, res, next) => {
    const records = await prisma.member.findMany();
    res.json({
        members: records,
    });
});

router.post(
    "/",
    requireAuth,
    [
        checkSchema({
            summonerId: {
                in: ["body"],
                errorMessage: "Missing summoner id or name",
                isString: true,
                toString: true,
            },
            scrimId: {
                in: ["body"],
                errorMessage: "Missing scrim id",
                isInt: true,
                toInt: true,
            },
        }),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("validation error");
            res.status(400).json({
                errors: errors.array().map((err) => err.msg),
            });
        }

        const { summonerId, scrimId } = req.body;
        const safeSummonerId = decodeURI(summonerId);
        let summoner = await prisma.summoner.findUnique({
            where: {
                id: safeSummonerId,
            },
        });

        if (!summoner) {
            try {
                const summonerResponse =
                    await SummonerService.getSummonerByName(safeSummonerId);
                summoner = await prisma.summoner.create({
                    data: {
                        ...summonerResponse,
                    },
                });
            } catch (err) {
                return next(err);
            }
        }

        const memberExists = await prisma.member.findFirst({
            where: {
                AND: [
                    {
                        summonerId: {
                            equals: safeSummonerId,
                        },
                    },
                    {
                        scrimId: {
                            equals: scrimId,
                        },
                    },
                ],
            },
        });

        if (memberExists) {
            return next(new Error("This member is already in the pool"));
        }

        const member = await prisma.member
            .create({
                data: {
                    summonerId: summoner.id,
                    scrimId,
                },
            })
            .catch(next);

        res.json({
            member,
        });
    }
);

router.get("/:id", requireAuth, async (req, res, next) => {
    const member = await prisma.member.findUnique({
        where: {
            id: Number(req.params.id),
        },
        include: {
            summoner: true,
            team: true,
            scrim: true,
        },
    });

    if (member) {
        res.status(200).json({
            member,
        });
    } else {
        res.status(404).json({
            message: "Member not found",
        });
    }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
    await prisma.member.delete({
        where: {
            id: Number(req.params.id),
        },
    });

    res.status(200).json({
        message: "Success",
    });
});

router.put("/:id", requireAuth, async (req, res, next) => {
    await prisma.member.update({
        where: {
            id: Number(req.params.id),
        },
        data: {
            ...req.body,
        },
    });
});

export default router;
