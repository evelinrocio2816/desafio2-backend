const fs = require("fs").promises;

class ProductManager {
  static ultId = 0;
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct(newObject) {
    let { title, description, price, image, code, stock } = newObject;
    if ((!title || !description || !price || !image, !code || !stock)) {
      console.log("Todos los campos deben ser completados");
      return;
    }
    if (this.products.some((item) => item.code === code)) {
      console.log("El codigo debe ser unico, no debe repetirse");
      return;
    }
    const newProduct = {
      id: ++ProductManager.ultId,
      title,
      description,
      price,
      image,
      code,
      stock,
    };
    this.products.push(newProduct);

    await this.saveFiles(this.products);
  }

  getProducts() {
    console.log(this.products);
  }

  async getProductsById(id) {
    try {
      const arrProducts = await this.readFiles();
      const buscado = arrProducts.find((item) => item.id === id);
      if (!buscado) {
        console.log("PRODUCTO NO ENCONTRADO!👎");
      } else {
        console.log("PRODUCTO ENCONTRADO 👍", buscado);
        return buscado;
      }
    } catch (error) {
      console.log("error al leer el archivo", error);
    }

    // const product= this.products.find(item =>item.id ===id)
    // if(!product){
    //     console.log('PRODUCTO NO ENCONTRADO!👎');
    // }else{
    //     console.log('PRODUCTO ENCONTRADO 👍',product);
    // }
  }

  async readFiles() {
    try {
      const res = await fs.readFile(this.path, "utf-8");
      const arrProducts = JSON.parse(res);
      return arrProducts;
    } catch (error) {
      console.log("Error al Leer el archivo", error);
    }
  }
  async saveFiles(arrProducts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrProducts, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo", error);
    }
  }
  //Actualizo un producto

  async upDateProducts(id, productUpdated) {
    try {
      const arrProducts = await this.readFiles();
      const index = arrProducts.findIndex((item) => item.id === id);
      if (index !== -1) {
        arrProducts.splice(index, 1, productUpdated);
        await this.saveFiles(arrProducts);
      } else {
        console.log("No se encontro el producto");
      }
    } catch (error) {
      console.log("error al actualizar el producto", error);
    }
  }
  //Elimino el producto 
  async deleteProduct(id) {
    try {
      const arrProducts = await this.readFiles();
      const index = arrProducts.findIndex((item) => item.id === id);
      if (index !== -1) {
        arrProducts.splice(index, 1);
        await this.saveFiles(arrProducts);
        console.log("Producto eliminado correctamente");
      } else {
        console.log("No se encontró el producto");
      }
    } catch (error) {
      console.log("Error al eliminar el producto", error);
    }
  }
}
//Testing

const manager = new ProductManager("./products.json");

manager.getProducts();

const cuaderno = {
  title: "Ledesma",
  description: "cuadernillo tapa dura , 100 hojas cuadriculadas",
  price: 4100,
  image: "sin imagen",
  code: "abc123",
  stock: 10,
};
manager.addProduct(cuaderno);

const lapicera = {
  titulo: "lapicera big",
  description: "color negra , trazo fino",
  price: 450,
  image: "sin imagen",
  code: "def456",
  stock: 96,
};
manager.addProduct(lapicera);

//ahora verifico que no tengan el mismo codigo

const cartuchera = {
  titulo: "cartuchera",
  description: "color negra ",
  price: 5450,
  image: "sin imagen",
  code: "def456",
  stock: 3,
};
manager.addProduct(cartuchera);

//no agrego el stock

const lapiceras = {
  titulo: "lapicera big",
  description: "color negra , trazo fino",
  price: 450,
  image: "sin imagen",
  code: "def455",
  // stock: 96
};
manager.addProduct(lapiceras);

//llamo al metodo getProducts y debe aparecer el producto recien agegado

manager.getProducts();

//testeamos por ID

async function testForId() {
  const buscado = await manager.getProductsById(2);
  console.log(buscado);
}

testForId();

//Producto de reemplazo

const cuadernillo = {
    id: 1,
    title: "cuadernillo",
    description: "cuadernillo tapa dura , 100 hojas cuadriculadas",
    price: 4100,
    image: "sin imagen",
    code: "abc123",
    stock: 10,
  };
 async function testUpdated(){
    await manager.upDateProducts(1, cuadernillo)
 }
 testUpdated();

 //Elimino Producto

async function testDeleteProduct() {
    await manager.deleteProduct(1,cuadernillo); 
    
  }
  
  testDeleteProduct();
  