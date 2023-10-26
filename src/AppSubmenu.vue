<template>
	<ul v-if="items">
		<template v-for="(item,i) of items">
			<li v-if="visible(item) && !item.separator" :key="item.label || i" :class="[{'layout-menuitem-category': root, 'active-menuitem': activeIndex === i && !item.to && !item.disabled}]" role="none">
				<template v-if="root">
					<div 
						class="layout-menuitem-root-text" 
						:aria-label="item.label" 
						:style="textoCor">
							{{item.label}}
					</div>
					<appsubmenu :items="visible(item) && item.items" @menuitem-click="$emit('menuitem-click', $event)"></appsubmenu>
				</template>
				<template v-else>
					<router-link v-if="item.to" :to="item.to" :class="[item.class, 'p-ripple', {'p-disabled': item.disabled}]" :style="item.style" @click="onMenuItemClick($event,item,i)" :target="item.target" :aria-label="item.label" exact role="menuitem" v-ripple>
						<!-- <i :class="item.icon" :style="textoCor"></i> -->
						<font-awesome-icon :icon="'fa-regular fa-circle'" />
						<span :style="textoCor">{{item.label}}</span>
						<i v-if="item.items" class="pi pi-fw pi-angle-down menuitem-toggle-icon" :style="textoCor"></i>
						<Badge v-if="item.badge" :value="item.badge"></Badge>
					</router-link>
					<a v-if="!item.to" :href="item.url||'#'" :style="item.style" :class="[item.class, 'p-ripple', {'p-disabled': item.disabled}]" @click="onMenuItemClick($event,item,i)" :target="item.target" :aria-label="item.label" role="menuitem" v-ripple>
						<!-- <i :class="item.icon" :style="textoCor"></i>
						<font-awesome-icon 
							:icon="item.icon" 
							v-if="item.icon">
						</font-awesome-icon> -->
						<!-- <span :class="item.icon"></span> -->
						<font-awesome-icon :icon="'asterisk'" v-if="item.icon == 'glyphicon glyphicon-asterisk'"></font-awesome-icon>
						<font-awesome-icon :icon="item.icon" v-else-if="item.icon"></font-awesome-icon>
						<span :style="textoCor">{{item.label}}</span>
						<i :style="textoCor"
							v-if="item.items" 
							class="pi pi-fw pi-angle-down menuitem-toggle-icon" 
							></i>
						<Badge v-if="item.badge" :value="item.badge"></Badge>
					</a>
					<transition name="layout-submenu-wrapper">
						<appsubmenu v-show="activeIndex === i" :items="visible(item) && item.items" @menuitem-click="$emit('menuitem-click', $event)"></appsubmenu>
					</transition>
				</template>
			</li>
			<li class="p-menu-separator" :style="item.style" v-if="visible(item) && item.separator" :key="'separator' + i" role="separator"></li>
		</template>
	</ul>
</template>
<script>
import ParametroService from './service/geral/ParametroService';

export default {
	name: 'appsubmenu',
	props: {
		items: Array,
		root: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			activeIndex : null,

			parametroService : null,
			parametros : null,
			textoCor: "color: ",
			submenuCor: "background-color: ",
		}
	},

	created() {
		this.parametroService = new ParametroService();
	},

	async mounted() {
		/*
		await this.parametroService.all().then((data) => {
			this.parametros = data[0];
			this.menuCor += this.parametros.CORMENU
			this.textoCor += this.parametros.CORTEXMENU
		});
		*/

		// if (this.parametroService.CORMENU != null) {
		// 	this.corTexto += "#FFFFFF"
		// }else {
		// 	this.corTexto += "#212121"
		// }
	},

	methods: {
		onMenuItemClick(event, item, index) {
			if (item.disabled) {
				event.preventDefault();
				return;
            }

            if (!item.to && !item.url) {
                event.preventDefault();
            }

			//execute command
			if (item.command) {
                item.command({originalEvent: event, item: item});
			}

			this.activeIndex = index === this.activeIndex ? null : index;

			this.$emit('menuitem-click', {
				originalEvent: event,
				item: item
			});
		},
		visible(item) {
			return (typeof item.visible === 'function' ? item.visible() : item.visible !== false);
		}
	}
}
</script>
