<template>
	<el-container>
		<el-aside>
			<Navigation />
		</el-aside>
		<el-main>
			<router-view/>
		</el-main>
	</el-container>
</template>

<script>
	import Navigation from './widgets/Navigation'
	export default {
	  name: 'DataViewMain',
	  components: {
	    Navigation
	  }
	}
</script>

<style scoped>

</style>
