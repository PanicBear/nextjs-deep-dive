import type { ResponseType } from "@customTypes/index";
import { client, withApiSession, withHandler } from "@libs/server/index";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "POST":
      const {
        query: { id },
        session: { user },
      } = req;
      const seller = await client.product.findUnique({
        where: {
          id: +id,
        },
        select: {
          userId: true,
        },
      });
      if (user && user.id === seller?.userId) {
        res.json({
          ok: false,
          message: "seller can't chat one's self",
        });
      }

      let chatRoom = await client.chatRoom.findFirst({
        where: {
          product: {
            userId: seller?.userId,
            id: +id,
          },
          buyerId: user?.id,
        },
        select: {
          id: true,
        },
      });
      if (!chatRoom && user) {
        chatRoom = await client.chatRoom.create({
          data: {
            productId: +id,
            buyerId: user.id,
          },
          select: {
            id: true,
          },
        });
      }
      res.json({
        ok: true,
        chatRoomId: chatRoom?.id,
      });
      break;
    case "GET":
    case "PUT":
    case "DELETE":
    default:
      res.json({
        ok: false,
        message: "Method not allowed",
      });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
