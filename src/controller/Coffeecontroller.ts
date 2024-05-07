import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs"
import { BASE_URL } from "../global";

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getAllCoffee = async (request: Request, response: Response) => {
    try {
        const { golek } = request.query
        const allCoffee = await prisma.coffee.findMany({
            where: { name: { contains: golek?.toString() || "" } }
        })
        /** contains means search name of Coffee based on sent keyword */
        return response.json({
            status: true,
            data: allCoffee,
            message: `Coffee has retrieved`
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

export const createCoffee = async (request: Request, response: Response) => {
    try {
        const { name, price, size } = request.body /** get requested data (data has been sent from request) */

        /** variable filename use to define of uploaded file name */
        let filename = ""
        if (request.file) filename = request.file.filename /** get file name of uploaded file */

        /** process to save new Coffee */
        const newCoffee = await prisma.coffee.create({
            data: { name, price: Number(price), size, image: filename }
        })
        /** price and stock have to convert in number type */

        return response.json({
            status: true,
            data: newCoffee,
            message: `New Coffee has created`
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

export const updateCoffee = async (request: Request, response: Response) => {
    try {
        const { id } = request.params /** get id of Coffee's id that sent in parameter of URL */
        const { name, price, size } = request.body /** get requested data (data has been sent from request) */

        /** make sure that data is exists in database */
        const findCoffee = await prisma.coffee.findFirst({ where: { id: Number(id) } })
        if (!findCoffee) return response
            .status(200)
            .json({ status: false, message: `Coffee is not found` })

        let filename = findCoffee.image /** default value of variable filename based on saved information */
        if (request.file) {
            filename = request.file.filename
            let path = `${BASE_URL}/public/Coffee-image/${findCoffee.image}`
            let exists = fs.existsSync(path)
            if (exists && findCoffee.image !== ``) fs.unlinkSync(path)

            /** this code use to delete old exists file if reupload new file */
        }

        /** process to update Coffee's data */
        const updatedCoffee = await prisma.coffee.update({
            data: {
                name: name || findCoffee.name,
                price: price ? Number(price) : findCoffee.price,
                size: size  || findCoffee.size,
                image: filename
            },
            where: { id: Number(id) }
        })

        return response.json({
            status: true,
            data: updatedCoffee,
            message: `Coffee has updated`
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

export const dropCoffee = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        /** make sure that data is exists in database */
        const findCoffee = await prisma.coffee.findFirst({ where: { id: Number(id) } })
        if (!findCoffee) return response
            .status(200)
            .json({ status: false, message: `Coffee is not found` })

        /** prepare to delete file of deleted Coffee's data */
        let path = `${BASE_URL}/public/Coffee-image/${findCoffee.image}` /** define path (address) of file location */
        let exists = fs.existsSync(path)
        if (exists && findCoffee.image !== ``) fs.unlinkSync(path) /** if file exist, then will be delete */

        /** process to delete Coffee's data */
        const deletedCoffee = await prisma.coffee.delete({
            where: { id: Number(id) }
        })
        return response.json({
            status: true,
            data: deletedCoffee,
            message: `Coffee has deleted`
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