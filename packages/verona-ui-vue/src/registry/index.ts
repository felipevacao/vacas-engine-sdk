import { Component, markRaw } from 'vue';
import VInput from '../components/VInput.vue';
import VSelect from '../components/VSelect.vue';
import VTextArea from '../components/VTextArea.vue';
import VCheckbox from '../components/VCheckbox.vue';

class ComponentRegistry {
  private registry: Record<string, Component> = {
    'text': VInput,
    'email': VInput,
    'password': VInput,
    'tel': VInput,
    'number': VInput,
    'select': VSelect,
    'textarea': VTextArea,
    'checkbox': VCheckbox,
    'switch': VCheckbox // O Switch pode usar o mesmo componente visualmente adaptado ou o checkbox puro
  };

  register(formType: string, component: Component) {
    this.registry[formType] = markRaw(component);
  }

  getComponent(formType: string): Component | string {
    return this.registry[formType] || VInput;
  }
}

export const veronaRegistry = new ComponentRegistry();
