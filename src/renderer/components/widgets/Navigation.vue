<template>
	<div class="Navigation">
		<!--    <el-button @click="handleClear">清空缓存</el-button>-->
		<div style="padding: 10px">
			<el-input
					placeholder="输入文件名"
					v-model="filterText">
			</el-input>
		</div>
		<el-tree
				:data="categories"
				node-key="id"
				default-expand-all
				:props="defaultProps"
				:filter-node-method="filterNode"
				ref="tree"
				:expand-on-click-node="false">
			<router-link class="custom-tree-node" slot-scope="{ node, data }" :to="{name: 'DataNode', params: {id: data['id']}}">
				<span class="myLeaf" v-if="data['children'].length === 0 && data['type'] === 0"/>
				<i class="el-icon-document" v-if="data['type'] === 1" style="color: #217346"/>
				<i class="el-icon-picture" v-if="data['type'] === 2"/>
				{{ data['name'] }}
			</router-link>
		</el-tree>
	</div>
</template>

<script>
	export default {
	  name: 'Navigation',
	  computed: {
	    categories () {
	      if (this.$store.state.categories === null) {
	        return []
	      } else {
	        return this.$store.state.categories
	      }
	    }
	  },
	  data () {
	    return {
	      filterText: '',
	      defaultProps: {
	        children: 'children',
	        label: 'name'
	      },
	      postNodeForm: {
	        id: '',
	        name: '',
	        order: '',
	        parentId: '',
	        type: 0
	      }
	    }
	  },
	  watch: {
	    filterText (val) {
	      this.$refs['tree'].filter(val)
	    }
	  },
	  methods: {
	    filterNode (value, data) {
	      if (!value) return true
	      return data.name.indexOf(value) !== -1
	    },
	    handleClear () {
	      this.$store.commit('clear')
	    }
	  }
	}
</script>

<style lang="scss">
	.Navigation{
		a{
			display: block!important;
			width: 100% !important;
			text-decoration: none;
			overflow-x: hidden;
			color: black;
		}
		.router-link-active{
			color: red;
			font-weight: bolder;
		}
		.el-tree .el-tree-node__expand-icon.expanded
		{
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}
		.el-tree .el-icon-caret-right:before
		{
			background: url("../../assets/folder.png") no-repeat 0 3px;
			content: '';
			display: block;
			width: 18px;
			height: 18px;
			font-size: 18px;
			background-size: 18px;
		}
		.el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before
		{
			background: url("../../assets/folder.png") no-repeat 0 3px;
			content: '';
			display: block;
			width: 18px;
			height: 18px;
			font-size: 18px;
			background-size: 18px;
		}
		.el-tree-node__expand-icon.is-leaf::before
		{
			display: none;
		}
		.is-leaf, .el-tree-node__expand-icon, .el-icon-caret-right
		{
			padding: 6px 0!important;
		}
		.myLeaf{
			background: url("../../assets/folder.png") no-repeat 0 3px;
			content: '';
			display: inline-block;
			width: 18px;
			height: 18px;
			font-size: 18px;
			background-size: 18px;
		}
	}

</style>
