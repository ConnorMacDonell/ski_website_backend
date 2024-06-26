import express from "express";
import { PermissionFlag } from "./shared.permissionflag.enum";
import debug from 'debug';

const log: debug.IDebugger = debug('app:shared-permission-middleware');

class SharedPermissionMiddleware {
  permissionFlagRequired(requiredPermissionFlag: PermissionFlag){
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        const userPermissionFlags = parseInt(res.locals.jwt.permisionFlags);
        if(userPermissionFlags & requiredPermissionFlag){
          next();
        } else {
          res.status(403).send();
        }
      } catch(err) {
        log(err);
      }
    };
  }

  async onlySameUserOrAdminCanDoThisAction(req: express.Request, res: express.Response, next: express.NextFunction){
    const userPermissionFlags = parseInt(res.locals.jwt.permissionFlags);
    if(req.params && req.params.userId && req.params.userId === res.locals.jwt.userId){
      return next();
    } else {
      if(userPermissionFlags & PermissionFlag.ADMIN_PERMISSION){
        return next();
      } else {
        return res.status(403).send();
      }
    }
  }
}

export default new SharedPermissionMiddleware();
