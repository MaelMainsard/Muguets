import type { Schema, Attribute } from '@strapi/strapi';

export interface VariantProductVariantProduct extends Schema.Component {
  collectionName: 'components_variant_product_variant_products';
  info: {
    displayName: 'Variant product';
    icon: 'plus';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    stock: Attribute.Integer & Attribute.Required & Attribute.DefaultTo<0>;
    images: Attribute.Media;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'variant-product.variant-product': VariantProductVariantProduct;
    }
  }
}
