import { produtosController } from "./controller";
import { BaseServices } from "@services/baseServices";
import { produtosEntity } from "./entity";
import { ServiceFactory } from "@services/serviceFactory";

export class produtosService extends BaseServices < produtosEntity, produtosController > {

	constructor(
		protected entityController: produtosController = new produtosController
	) {
	    super(entityController)
    }

}

// Registro automático para Eager Loading
ServiceFactory.register('produtos', () => new produtosService());
