import Vue from 'vue'
(function () {
  let openDelay = false
  Vue.directive('intervalclick', function (el, binding) {
    el.onclick = function (e) {
      if (openDelay) return
      openDelay = !openDelay
      if (!binding.value) {
        alert('未传入Value数据！')
        return
      }
      let func = binding.value['func']
      let time = binding.value['time']
      if (typeof time !== 'number') {
        alert('传入等待时间错误')
        return
      }
      let args = []
      for (const key in binding.value) {
        if (binding.value.hasOwnProperty(key)) {
          if (key === 'func' || key === 'time') continue
          args.push(binding.value[key])
        }
      }
      setTimeout(() => {
        openDelay = !openDelay
      }, time)
      func(...args)
    }
  })
})()
