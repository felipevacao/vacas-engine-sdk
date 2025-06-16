import express from 'express';
import { tokenMiddleware } from '@middlewares/token';
import { AuthController } from '@controllers/AuthController';
import { UserExpressAdapter } from '@dynamic-modules/adapters/userExpress.adapter';

const router = express.Router();

const authController = new AuthController();
const userExpressAdapter = new UserExpressAdapter(authController);

router.post('/login', userExpressAdapter.login.bind(userExpressAdapter));

// change password
router.get('/password/metadata', tokenMiddleware, (req, res) => {

  res.json({
    success: true,
    data: {
        "currentPassword": "string",
        "newPassword": "string",
    },
  })
})

router.patch('/password', tokenMiddleware, userExpressAdapter.updatePassword.bind(userExpressAdapter));

router.post('/logout', tokenMiddleware, userExpressAdapter.logout.bind(userExpressAdapter));

export default router;