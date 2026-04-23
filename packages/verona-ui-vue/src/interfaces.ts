import { FieldMetadata, TableMetadata } from '@verona/sdk';
import { Component } from 'vue';

export interface VueFieldMetadata extends FieldMetadata {
  component: Component | string;
  props?: Record<string, any>;
}

export interface VueTableMetadata extends TableMetadata {
  fields: VueFieldMetadata[];
}
