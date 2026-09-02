import { makeAdmin as makeAdminService } from "../../service/admin/index.js";

export const makeAdmin = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const updatedUser =
            await makeAdminService(userId);

        return res.status(200).json({
            success: true,
            message: "User promoted to admin successfully",
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });
    } catch (error) {
        next(error);
    }
};