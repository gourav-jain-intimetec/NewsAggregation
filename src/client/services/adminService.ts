import { IExternalServer, ICategory } from '../../utils/interfaces';
import { ClientExternalNewsServerService } from './clientExternalNewsServerService';

export class AdminService {
    private externalNewsServerService = new ClientExternalNewsServerService();

    async listServers(): Promise<IExternalServer[]> {
        return this.externalNewsServerService.listServers();
    }

    async viewServer(name: string): Promise<IExternalServer> {
        return this.externalNewsServerService.viewServer(name);
    }

    async updateServerKey(name: string, newKey: string): Promise<void> {
        return this.externalNewsServerService.updateApiKey(name, newKey);
    }
}
