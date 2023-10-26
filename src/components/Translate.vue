<template>
  {{ dynamicText }}
</template>

<script>
import TraducaoService from '../service/TraducaoService';

export default {
  props : ['text'],
  data : function() {
    return {
      dynamicText : this.text
    };
  },
  mounted : async function () {
    const traducaoService = new TraducaoService();

    const response = await traducaoService.once();

    this.terms = (response);

    console.log("Translate component created");
    
    this.translate();
  },
  methods : {
    translate() {
      this.dynamicText = this.terms[this.text] ?? this.text;
    }
  }
}
</script>