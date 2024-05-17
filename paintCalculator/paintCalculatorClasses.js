
class Area {
    constructor(shape, dimensions) {
      this.shape = shape;
      this.dimensions = dimensions;
      this.area = this.calculateArea();
    }

    calculateArea() {
      if (this.shape === 'Rectangle') {
        return this.dimensions[0] * this.dimensions[1];
      } 
      else if (this.shape === 'Triangle') {
        const [a, b, c] = this.dimensions;
        const s = (a + b + c) / 2;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
      } 
      else if (this.shape === 'Circle') {
        return (this.dimensions[0] / 2) ** 2 * Math.PI;
      }
    }
  }


class Catalogue{
    constructor(){

        this.catalogue= {
            'Dulux': {
                "Matt White": 2.40,
                "Pure Brilliant White Silk Emulsion": 2.40,
                "Matt Standard Emerald Glade": 2.45,
                "Matt Easycare Willow Emulsion": 2.45,
                "Kiwi Crush Silk": 8.80
            },
            'Zinsser': {
                "Matt White Anti Mold": 21,
                "Perma White Satin Anti Mold": 16.80,
                "Black Multi Surface AllCoat": 28
            },
            'Berger': {
                "Silk Emulsion Lemon Glow": 8.40,
                "Navy Blue Non-Drip": 22.19,
                "Quick Dry Matt White": 12.20,
                "Gloss Non-Drip Russian Red": 22.19,
                "Satin Magnolla": 28
            }
        };
    }

    setCatalogue(catalogue){
        this.catalogue = catalogue;
    }

    updateCatalogue(catalogue){
        this.catalogue = { ...this.catalogue, ...catalogue};
    }

    getCatalogue(){
        console.log(this.catalogue);
    }
}