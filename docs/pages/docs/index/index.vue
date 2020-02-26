<template lang="md" src="./index.md" />
<script>
  import View from '@components/docs/View';
  import { head } from "@helpers/head";
  import { IAlert, IIcon } from "@inkline/inkline/src/components";

  export default {
    name: 'DocIndexView',
    layout: 'documentation',
    extends: View,
    head: head('docs-index'),
    components: {
      IAlert,
      IIcon
    }
  };
</script>
