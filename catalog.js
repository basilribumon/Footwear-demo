export const STORAGE_PRODUCTS='athman-products';
export const STORAGE_ORDERS='athman-orders';
export const initialProducts=[
 {id:'s7782',name:'Arabic Sandal — S7782',category:'Men',price:3499,badge:'BESTSELLER',color:'Sand / Tan',image:'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=82',swatches:['#d5c3a1','#292c29','#9b7550']},
 {id:'at08',name:'Arabic Sandal — AT08',category:'Men',price:3299,badge:'NEW',color:'Stone / Black',image:'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=900&q=82',swatches:['#c9c4b4','#242522','#a77d54']},
 {id:'astra',name:'Astra Heeled Sandal',category:'Women',price:3899,badge:'',color:'Warm Tan',image:'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=82',swatches:['#a96d45','#4c3631','#d8c8b0']},
 {id:'najma',name:'Najma Ostrich Sandal',category:'Women',price:4299,badge:'LIMITED',color:'Soft Beige',image:'https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=900&q=82',swatches:['#d3c0a2','#a98060']},
 {id:'at01v2',name:'Arabic Sandal — AT01 V2',category:'Men',price:3499,badge:'',color:'Olive / Cream',image:'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=82',swatches:['#72755b','#e1d9c9','#242522']},
 {id:'at01b',name:'Boy’s Arabic Sandal — AT01B',category:'Boys',price:2299,badge:'',color:'Classic Black',image:'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=82',swatches:['#292b29','#d0c2a5']},
 {id:'athman60',name:'Athman Star — 60',category:'Men',price:4799,badge:'ATHMAN STAR',color:'Cream Leather',image:'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=82',swatches:['#e2d9c9','#c7b59b']},
 {id:'at19',name:'Arabic Sandal — AT19',category:'Men',price:3299,badge:'',color:'Dark Brown',image:'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=900&q=82',swatches:['#40332c','#ddd2bd','#222321']}
];
export function loadProducts(){try{const saved=JSON.parse(localStorage.getItem(STORAGE_PRODUCTS));return Array.isArray(saved)?saved:structuredClone(initialProducts)}catch{return structuredClone(initialProducts)}}
export function storeProducts(items){localStorage.setItem(STORAGE_PRODUCTS,JSON.stringify(items))}
