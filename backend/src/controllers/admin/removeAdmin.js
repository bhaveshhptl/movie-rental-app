import { removeAdmin as removeAdminService } from "../../service/admin/index.js";

export const removeAdmin = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const updatedUser =
            await removeAdminService(userId);

        return res.status(200).json({
            success: true,
            message: "Admin privileges removed successfully",
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