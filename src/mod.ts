import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { BaseClasses } from "@spt-aki/models/enums/BaseClasses";
import modConfig from "../config/config.json";

class AmmoSetFragmentation implements IPostDBLoadMod{
   	private logger: ILogger;
	private database: IDatabaseTables;
	private loader: PreAkiModLoader;
	
    public postDBLoad(container: DependencyContainer): void {		
		this.logger = container.resolve<ILogger>("WinstonLogger");
		this.database = container.resolve<DatabaseServer>("DatabaseServer").getTables();
		this.loader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
		
		const items = this.database.templates.items;
        
		for(const [_, item] of Object.entries(items)) {
			if(this.isSet(item._parent) && this.isSet(item._props)) {
				if(this.isAmmo(item._id)) {
					item._props.FragmentationChance = modConfig.FragmentationValue;
				}
			}
		}

    }
	
	public isAmmo(item: string): boolean {
		const items = this.database.templates.items;
		if(this.isSet(items[item]._parent) && items[item]._parent === BaseClasses.AMMO ) {
			return true;
		}
		return false;
	}
	
	public isSet(variable: any): boolean {
		if(variable !== undefined && variable !== null) {
			if(typeof variable === "string" && variable !== "") {
				return true;
			}
			if(Array.isArray(variable) && variable.length > 0) {
				return true;
			}
			if(typeof variable === "object" && !Array.isArray(variable) && Object.entries(variable).length > 0) {
				return true;
			}
		}
		return false;
	}
}

module.exports = { mod: new AmmoSetFragmentation() }