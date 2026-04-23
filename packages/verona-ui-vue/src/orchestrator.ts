import { FormOrchestrator, FormState } from '@verona/sdk';
import { veronaRegistry } from './registry';
import { VueTableMetadata } from './interfaces';

export class VeronaVueOrchestrator extends FormOrchestrator {
  async getVueFormConfig(entity: string, id?: string | number): Promise<any> {
    const state = await this.getFormConfig(entity, id);
    
    // "Enriquece" o metadata básico com os componentes do Vue
    const vueMetadata: VueTableMetadata = {
      ...state.metadata,
      fields: state.metadata.fields.map(field => ({
        ...field,
        component: veronaRegistry.getComponent(field.formType),
        props: {
          label: field.label,
          required: field.required,
          name: field.name
        }
      }))
    };

    return {
      ...state,
      metadata: vueMetadata
    };
  }
}
