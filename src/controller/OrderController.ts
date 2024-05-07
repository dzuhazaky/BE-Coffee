import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";


const prisma = new PrismaClient({ errorFormat: "pretty" });

export const createOrder = async (request: Request, response: Response) => {
  try {
    const { customerName, order_type, order_date, orderDetails } = request.body;

    const newOrder = await prisma.orderList.create({
      data: { customerName, order_type, order_date },
    });

    /** loop details of sale to save in database */
    for (let index = 0; index < orderDetails.length; index++) {
      const { coffee_id, quantity, price } = orderDetails[index];
      await prisma.orderDetail.create({
        data: {
          order_id: newOrder.id,
          coffee_id: Number(coffee_id),
          quantity: Number(quantity),
          price: Number(price),
        },
      });
    }
    return response
      .json({
        status: true,
        data: newOrder,
        message: `New Order has created`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};

export const getAllOrder = async (request: Request, response: Response) => {
    try {
        const { search } = request.query
        const allOrder = await prisma.orderList.findMany({
            where: {
                OR: [
                    { customerName: { contains: search?.toString() || "" } },
                    { order_type: { contains: search?.toString() || "" } }
                ]
            },
            orderBy: { order_date: "desc" },
            include: { orderDetails: {include: {coffee: true}} } 
        })
        return response.json({
            status: true,
            data: allOrder,
            message: `Sale list has retrieved`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const dropOrder = async (request: Request, response: Response) => {
    try {
        const { id } = request.params 

        const findSale = await prisma.orderList.findFirst({ where: { id: Number(id) } })
        if (!findSale) return response
            .status(200)
            .json({ status: false, message: `Sale is not found` })

        /** process to delete details of sales */
        let dropSaleDetail = await prisma.orderDetail.deleteMany({ where: { id: Number(id) } })
        /** process to delete of sale */
        let dropSale = await prisma.orderList.delete({ where: { id: Number(id) } })

        return response.json({
            status: true,
            data: dropSale,
            message: `Sale has deleted`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}