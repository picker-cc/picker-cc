<template src="./index.html" />
<style lang="scss" src="./index.scss"></style>
<script>
import { IHeader, IContainer, IRow, IColumn, IButton, ITooltip } from "@inkline/inkline/src/index";
import { head } from '@helpers/head'
import Sponsor from '@components/Sponsor';
import GithubButton from 'vue-github-button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
    name: 'doc-index',
    layout: 'Default',
    head: head('index', {
        preserve: {
            description: true
        }
    }),
    components: {
        IHeader,
        IContainer,
        IRow,
        IColumn,
        IButton,
        ITooltip,
        GithubButton,
        Sponsor,
        FontAwesomeIcon
    },
    data() {
        const defaultSponsor = {
            title: '赞助我们',
            url: '',
            placeholder: true
        };

        return {
            sponsors: {
                large: [
                    defaultSponsor,
                    defaultSponsor,
                    {
                        title: 'Picker - 为自由创业者准备的工作室系统',
                        image: require('@/static/images/sponsors/large/picker.png'),
                        url: 'https://picker.cc',
                        default: true
                    },
                    defaultSponsor,
                    defaultSponsor
                ]
            }
        };
    }
};
</script>
