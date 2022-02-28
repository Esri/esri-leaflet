/* eslint-env mocha */
/* eslint-disable handle-callback-err */
describe('L.esri.DynamicMapLayer', function () {
  function createMap () {
    // create container
    var container = document.createElement('div');

    // give container a width/height
    container.setAttribute('style', 'width:500px; height: 500px;');

    // add container to body
    document.body.appendChild(container);

    return L.map(container).setView([37.75, -122.45], 12);
  }

  var base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjNGODI5NzkyMjYwMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjNGODI5N0EyMjYwMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGM0Y4Mjk3NzIyNjAxMUU1QkQ4QkI2REMzRDc1RDFDRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGM0Y4Mjk3ODIyNjAxMUU1QkQ4QkI2REMzRDc1RDFDRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrtQ3ewAAAAwUExURbS0tN3d3dLS0qurq4yMjNbW1pOTk76+vqKios7OzpqamsbGxuXl5YSEhM/Pz8zMzOLy6/8AAAGBSURBVHja7Nu7cgMhDAVQIfESCuL//zYidpLOSUNIcXEBw6znrHgImiX2e4Vp3SzkF3GHDh06dOjQoUOHDh06dOjQoUOHDh06dOjQoUOH/u90LfzTI1zKId2N2uuHVUma6hGdbcrryNT7HMf0LD+Nq/d6Uuf981J0zzGX+HOJSld08V4Zvfo5PTVqvVknVY4GNeaYajJ26cZL+WjsbzJ7rr1OSlbziKrNWnNLkmtV3/rJ2Ckvm1R2a1q0gmXJpvECmcrh2EOPqpW6W6qZUq8fb5SpxY44H7uGzqFLXiv0MVLLZnWMTnw+dn/qn7E/9Bh5M/272L/nnfa8U8pydt5njzWve9XNntbXmh/VUuyEbDHyIx/S3aSVJmpiLM1jv1Mk/uiR2oo+9zvRIX2fccYlKl87sT3SHsmbTfNHrtudf3m+F5kyIs/cuV2oSx2N1x09jhcvvG7p+06BWyV06NChQ4cOHTp06NChQ4cOHTp06NChQ4cO/df6ulno6nfQ7wIMAAxMgKYG08xRAAAAAElFTkSuQmCC';
  var Image1 = 'data:image/png;base64,' + base64Image;
  var Image2 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDI5MjEwNkEyMjYxMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDI5MjEwNkIyMjYxMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMjkyMTA2ODIyNjExMUU1QkQ4QkI2REMzRDc1RDFDRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowMjkyMTA2OTIyNjExMUU1QkQ4QkI2REMzRDc1RDFDRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpxjvssAAAAwUExURd3d3bOzs9LS0qurq4uLi9bW1ry8vMnJyZubm5KSkoODg6SkpOPj48TExM/Pz8zMzIOgIpEAAAGeSURBVHja7NvLbsQgDAVQbGPzGuz//9tCuumqUdXSVOplpEEaoTkYjMkmif25ximebMkfxB06dOjQoUOHDh06dOjQoUOHDh06dOjQoUOHDh3639OVy80IVuUzuheym8FcRCYf0Xl20c9HRMu5fYH/kp5vdKU+Iw89pvP+uKrvPWb1Enp1vjdcpYe2cS72STZmGeTBNowmM4lRYZexvky83C3QN/QX9draaJ1SabmuznJreaaxuvCV8tTtmJ4oR+mkeax5lNltsSy5eLaUSZdfm/s5va21NW17Hh6ZUq0r/DIb2U43tTW1OBi7z2x86RFt63rptVZbeVdz8O/oH2NfK1/mFXqK39Dtfd8lM+USe99FdTTmU3ofL+k+r6z7kPO1vef8XDPK9dCJ8yKmJlFkuhhf5918/UJtqkud+7yTDDtSba47jldgq7Tt2+4qe0z0mn3yVet2xdP7i/Dn7vdVXKWuOvPM04W7tGocz+jh6srxlB7xjT/AUyV06NChQ4cOHTp06NChQ4cOHTp06NChQ4f+//R4sqVH34N+E2AAO/CAbzhay1gAAAAASUVORK5CYII=';
  var WithLayers = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkU1NjVEN0MyMjZBMTFFNUI1NTc5NjAwMkVENUQwM0IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkU1NjVEN0QyMjZBMTFFNUI1NTc5NjAwMkVENUQwM0IiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyRTU2NUQ3QTIyNkExMUU1QjU1Nzk2MDAyRUQ1RDAzQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyRTU2NUQ3QjIyNkExMUU1QjU1Nzk2MDAyRUQ1RDAzQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Plrqc7EAAABgUExURaioqL29vba2tsbGxrm5uaGhobi4uLOzs5ycnMTExKampr+/v7KysrCwsMDAwMLCwq2traSkpMvLy5+fn6+vr8PDw6KiosjIyKOjo6Wlpa6urqurq8rKyp6enpmZmczMzKKB4ZgAAAEfSURBVHja7NXZboMwEIVhLzhQCMRAWEOY93/L2k26qb1Erir9vkAGIX0+gz0o+cuh0NHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0T/HJUuqF91sVSWVEekmEe3jw/aSSG/trt0kdgi5VXLdn/q8D+pVpN6t6Nk1Tz0vZ5FVm1CVdbEi51HLNt4O1Y3yanlkfst+O5un7oawqqxWL7KVJmyHax5eWY7NXhXZff2ie/OuF13QbdmKDEV5CroOW0Plh+p2H3rzq+5s0GUOpbZLo+NHCLebO/bEFZ1qfuixHLWLuo9HcByHR3Z796m6TRcv4/Qx/TZJ0usmlbLX8ZdBR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR/8H+qsAAwABe1cCMD1LDwAAAABJRU5ErkJggg==';
  var WithTime = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjNGODI5N0QyMjYwMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjNGODI5N0UyMjYwMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGM0Y4Mjk3QjIyNjAxMUU1QkQ4QkI2REMzRDc1RDFDRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGM0Y4Mjk3QzIyNjAxMUU1QkQ4QkI2REMzRDc1RDFDRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pk/Tz9QAAAAwUExURbS0tMrKypKSkqOjo6urq87OztnZ2dTU1JmZmb29vZ2dncLCwtHR0bi4uM/Pz8zMzLWz9KMAAAGMSURBVHja7NtB0pggDAVgQgiEEML9b9to2wt0ht8uHjKoq4+HElcWj++al/NlK/EhHtChQ4cOHTp06NChQ4cOHTp06NChQ4cOHTp06ND/d11+WBdJUv6qLnQk8vgZnRKORx+R7uE53hlRjJzHbV2Il7BMprJ8+KlljKlWCxWS+7onVFfRqNMbhe7utCv7rGtEhDyPwuPWyg9uCTXu5KvOodvDh85OJHmQUxx/Tpf01nYtXAavXdswy/RHS18sZGattr6qkV/SNzdr+bLVeXKxdbOlvvuskmuhXLTbzqW5o/syLpzhdLqmTsXe7FNl6eC9zI2NXa7oIqqk5qJTdOUEyp/sjy5cZuptTrmkD9WuKdYpdXl99ZrZa6waVqYO25PHpVo38qFy68dmZHZbJaXMnsGXvdnHqjpv6c9+zop3iE5uqxzea3lun57DuLfjDkU8PSv87y7vNYlnJTohknBcqzb4vkOHDh06dOjQoUOHDh06dOjQoUOHDh06dOjQoUP/N/182cqn/0H/EmAAhleDsZtu/OkAAAAASUVORK5CYII=';
  var WithTimeTimeOptions = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkU1NjVENzgyMjZBMTFFNUI1NTc5NjAwMkVENUQwM0IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkU1NjVENzkyMjZBMTFFNUI1NTc5NjAwMkVENUQwM0IiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyOUVEREI3NTIyNkExMUU1QjU1Nzk2MDAyRUQ1RDAzQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyOUVEREI3NjIyNkExMUU1QjU1Nzk2MDAyRUQ1RDAzQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pno8yQ0AAABgUExURb29va6urqysrKioqLKyssvLy7Gxsbm5ucjIyLe3t7W1tcLCwr6+vsbGxrOzs8XFxbS0tMHBwaqqqsDAwLu7u7i4uLq6usfHx8nJyaurq8PDw8rKyqenp6Ojo7CwsMzMzDDnGUgAAAEDSURBVHja7NTbUoMwFIXhBhJCoJwLbT2t939L02A7elEdO2ov/JkMJGTtfMAAG91z26Cjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6PfTS//Xp/DnOYbyUou231I74+DpndXtTfT2mm+8UA/CbbPrbSVcicT5apMozDH3RKJQqpL1SEc5MKjdpOR+kGHY4r5hxiNx8rdqBd5n+761Oyqn7qFlRt90n0n39pB9VhrqV/iube4nF2rnLlV7324omvcXvS+HdTknbosLvVUnSvMslZl5c+/8+7K2H6Z/M0vzvG3QUdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dH//f6qwADAEAoWKnzLlffAAAAAElFTkSuQmCC';
  var WithDefs = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjlFRERCNkYyMjZBMTFFNUI1NTc5NjAwMkVENUQwM0IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjlFRERCNzAyMjZBMTFFNUI1NTc5NjAwMkVENUQwM0IiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyOUVEREI2RDIyNkExMUU1QjU1Nzk2MDAyRUQ1RDAzQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyOUVEREI2RTIyNkExMUU1QjU1Nzk2MDAyRUQ1RDAzQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pg3iWmcAAABgUExURa6urr+/v8HBwcfHx7u7u56enrW1taWlpby8vLe3t7i4uMPDw8LCwqioqKamppmZmcjIyKurq7Kysq2trZaWlsrKypqampycnKOjo5eXl8vLy52dnZubm6KiorCwsMzMzADumocAAAFCSURBVHja7NXLbsMgEEBRMAH8KHEc41cch///yxLXSVrJm0p2uuhlhzTSYWYYEOEvl0BHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR//FurxHb1q1Yk/jHvo1vXhV+CYk+UP3s37wpT09w4pB7qFbo3ya6hCMjbsse+ltoW/PMHndpe9CpIMxbtnV4psezKvasttFz47nqarPUTvG+pZlEXWh5aynQwxIJhdPY30sTTJ2G+uJrkRv0xDy/pl7crzNuvSx8TZzZsm9EmpjvRl62Wn1Q1d1/aUPccy6qq8W/VAmW0/c2F7G+5Va0fM7eTXy49H3vD1trDsd7LSqH3RMOkzmLBZdqbbYWL+5IKo13bfuNJdbF4tuBvf2l7Z5vbENfxw6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6+r/XPwUYAAXsVASA6AUmAAAAAElFTkSuQmCC';
  var WithToken = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjlFRERCNzMyMjZBMTFFNUI1NTc5NjAwMkVENUQwM0IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjlFRERCNzQyMjZBMTFFNUI1NTc5NjAwMkVENUQwM0IiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyOUVEREI3MTIyNkExMUU1QjU1Nzk2MDAyRUQ1RDAzQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyOUVEREI3MjIyNkExMUU1QjU1Nzk2MDAyRUQ1RDAzQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhEp84oAAABgUExURcjIyJycnLa2tsTExL+/v7i4uJ+fn5mZmbS0tK6urqmpqbGxsaamppqamsDAwLKysrOzs6WlpcrKyqurq6Kioq2trby8vMvLy8PDw6SkpKqqqqysrKOjo8HBwbq6uszMzKcQTFcAAAEoSURBVHja7NTbboMwDIDhhHOABginAm39/m/ZsFGpmqpdQVdpfy4Qsi2+WDhR8pdLoaOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojf5iu7I9AGB6oF2MUqcpXb+W2WZ+BMcNWUNUH6km4GDuJ9IXIOXrow2W279DzoSljI+JGkbh/6NIG8g69zrqu8FSWiUxaiU2aetNdrqNVN/596Hxe9FLuqw/z1OXX7xa/er/Yy6Zfm1vuE23i/MZU4qOpS8dd9VD3uXZPenPuNj2eIz8QlV7WrvPSfy+Vk9v3xKVBnchL3ZY3H6iKk1qH04xH6J0dyte6axK7JqrWj4Vu5Qj9t/X0k90/uGnR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dE/X78LMAB6zVaMpfGcowAAAABJRU5ErkJggg==';
  var WithParams = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAYFBMVEWurq6/v7/BwcHHx8e7u7uenp61tbWlpaW8vLy3t7e4uLjDw8PCwsKoqKimpqaZmZnIyMirq6uysrKtra2WlpbKysqampqcnJyjo6OXl5fLy8udnZ2bm5uioqKwsLDMzMwA7pqHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QweFBARX6eWJQAAAN5JREFUaN7t1UsOgkAMAFAO0X3vf0tjEJjyS0YFFz5CRjogj3aoDvnLbaDT6XQ6nU6n0+l0Op1Op9PpdDqdTqfT/1KPWIYYD+bpcTLmyQtyf947xmF6jI0e9+jNzLo09+Q+5jqlXBZm+oidKJdLLtCjYaNGNejWX3uu131mYrskS1Rfmt6Om5M51rMtcq6iUp5v61lbr3mUtX7in+rNmPWWTeeVE9FWfvrOcXt06bGXe5bcc7/y3XotXfv71lv5NzrOfxydTqfT6XQ6nU6n0+l0Op1Op9PpdDqdTv9gewCL6FN9G6INjAAAAABJRU5ErkJggg==';

  var url = 'http://services.arcgis.com/mock/arcgis/rest/services/MockMapService/MapServer';
  var urlWithParams = 'http://services.arcgis.com/mock/arcgis/rest/services/MockMapService/MapServer?foo=bar';
  var layer;
  var server;
  var map;
  var clock;

  var sampleResponse = {
    results: [
      {
        layerId: 0,
        layerName: 'Features',
        displayFieldName: 'Name',
        value: '0',
        attributes: {
          OBJECTID: 1,
          Name: 'Site'
        },
        geometryType: 'esriGeometryPoint',
        geometry: {
          x: -122.81,
          y: 45.48,
          spatialReference: {
            wkid: 4326
          }
        }
      }
    ]
  };

  beforeEach(function () {
    clock = sinon.useFakeTimers();
    server = sinon.fakeServer.create(); // { logger: console.log }
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png32&transparent=true&bboxSR=3857&imageSR=3857&f=json/), JSON.stringify({
      href: Image1
    }));
    layer = L.esri.dynamicMapLayer({
      url: url
    });
    map = createMap();
  });

  afterEach(function () {
    clock.restore();
    server.restore();
    map = null;
    sinon.restore();
  });

  it('should have a L.esri.dynamicMapLayer alias', function () {
    expect(L.esri.dynamicMapLayer({
      url: url
    })).to.be.instanceof(L.esri.DynamicMapLayer);
  });

  it('should display an attribution if one was passed', function () {
    L.esri.dynamicMapLayer({
      url: url,
      attribution: 'Esri'
    }).addTo(map);

    expect(map.attributionControl._container.innerHTML).to.contain('Esri');
  });

  it('will fire a loading event when it starts loading', function (done) {
    layer.on('loading', function (e) {
      expect(e.type).to.equal('loading');
      done();
    });
    layer.addTo(map);
    server.respond();
  });

  it('will fire a load event when it completes loading', function (done) {
    layer.on('load', function (e) {
      expect(e.type).to.equal('load');
      done();
    });
    layer.addTo(map);
    server.respond();
  });

  it('should store additional params passed in url', function () {
    layer = L.esri.dynamicMapLayer({
      url: urlWithParams
    }).addTo(map);

    expect(layer.options.requestParams).to.deep.equal({ foo: 'bar' });
    expect(layer.options.url).to.deep.equal(url + '/');
  });

  it('should use additional params passed in options', function (done) {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png32&transparent=true&bboxSR=3857&imageSR=3857&foo=bar&f=json/), JSON.stringify({
      href: WithParams
    }));
    layer = L.esri.dynamicMapLayer({
      url: url,
      requestParams: {
        foo: 'bar'
      }
    });
    layer.addTo(map);
    layer.on('load', function () {
      expect(layer._currentImage._url).to.equal(WithParams);
      done();
    });
    server.respond();
  });

  it('will load a new image when the map moves', function (done) {
    layer.addTo(map);

    layer.once('load', function () {
      layer.once('load', function () {
        expect(layer._currentImage._url).to.equal(Image2);
        done();
      });
      clock.tick(151);
      map.setView([37.30, -121.96], 10);
      server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png32&transparent=true&bboxSR=3857&imageSR=3857&f=json/), JSON.stringify({
        href: Image2
      }));
      server.respond();
    });
    server.respond();
  });

  it('can be added to a map', function (done) {
    layer.on('load', function () {
      expect(layer._currentImage).to.be.an.instanceof(L.ImageOverlay);
      expect(layer._currentImage._url).to.equal(Image1);
      expect(layer._currentImage._bounds).to.deep.equal(map.getBounds());
      done();
    });
    layer.addTo(map);
    server.respond();
  });

  it('can be removed from a map', function (done) {
    layer.on('load', function () {
      layer.removeFrom(map);
      expect(map.hasLayer(layer._currentImage)).to.equal(false);
      done();
    });
    layer.addTo(map);
    server.respond();
  });

  it('should expose the authenticate method on the underlying service', function () {
    var spy = sinon.spy(layer.service, 'authenticate');
    layer.authenticate('foo');
    expect(spy).to.have.been.calledWith('foo');
  });

  it('should expose the identify method on the underlying service', function () {
    // var spy = sinon.spy(layer.service, 'identify');
    var identify = layer.identify();
    expect(identify).to.be.an.instanceof(L.esri.IdentifyFeatures);
    expect(identify._service).to.equal(layer.service);
  });

  it('should propagate events from the service', function (done) {
    server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockMapService/MapServer&f=json', JSON.stringify({
      currentVersion: 10.2
    }));

    var requeststartSpy = sinon.spy();
    var requestendSpy = sinon.spy();

    layer.on('requeststart', requeststartSpy);
    layer.on('requestend', requestendSpy);

    layer.metadata(function () {
      done();
    });

    server.respond();

    expect(requeststartSpy.callCount).to.be.above(0);
    expect(requestendSpy.callCount).to.be.above(0);
  });

  it('should fetch a new image when redraw is called', function (done) {
    var spy = sinon.spy(layer, '_update');

    layer.on('load', function () {
      expect(spy.callCount).to.be.above(0);
      done();
    });

    layer.addTo(map);
    layer.redraw();

    server.respond();
  });

  it('should bring itself to the front', function (done) {
    layer.on('load', function () {
      var spy = sinon.spy(layer._currentImage, 'bringToFront');
      layer.bringToFront();
      expect(spy.callCount).to.be.above(0);
      done();
    });
    layer.addTo(map);
    server.respond();
  });

  it('should bring itself to the back', function (done) {
    layer.on('load', function () {
      var spy = sinon.spy(layer._currentImage, 'bringToBack');
      layer.bringToBack();
      expect(spy.callCount).to.be.above(0);
      done();
    });
    layer.addTo(map);
    server.respond();
  });

  it('should get and set opacity', function (done) {
    expect(layer.getOpacity()).to.equal(1);

    layer.on('load', function () {
      var spy = sinon.spy(layer._currentImage, 'setOpacity');
      layer.setOpacity(0.5);
      expect(layer.getOpacity()).to.equal(0.5);
      expect(spy.callCount).to.be.above(0);
      done();
    });

    layer.addTo(map);
    server.respond();
  });

  it('should get and set visible layers', function (done) {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png32&transparent=true&bboxSR=3857&imageSR=3857&layers=show%3A0%2C1%2C2&f=json/), JSON.stringify({
      href: WithLayers
    }));

    layer.once('load', function () {
      expect(layer._currentImage._url).to.equal(WithLayers);
      done();
    });

    layer.setLayers([0, 1, 2]);
    expect(layer.getLayers()).to.deep.equal([0, 1, 2]);
    layer.addTo(map);
    server.respond();
  });

  it('should get and set time ranges', function (done) {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png32&transparent=true&bboxSR=3857&imageSR=3857&time=1389254400000%2C1389513600000&f=json/), JSON.stringify({
      href: WithTime
    }));

    layer.once('load', function () {
      expect(layer._currentImage._url).to.equal(WithTime);
      done();
    });

    layer.setTimeRange(new Date('January 9 2014 GMT-0800'), new Date('January 12 2014 GMT-0800'));
    expect(layer.getTimeRange()).to.deep.equal([new Date('January 9 2014 GMT-0800'), new Date('January 12 2014 GMT-0800')]);
    layer.addTo(map);
    server.respond();
  });

  it('should get and set extra time options', function (done) {
    server.respondWith('GET', new RegExp(/http:\/\/services\.arcgis\.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png32&transparent=true&bboxSR=3857&imageSR=3857&timeOptions=%7B%22foo%22%3A%22bar%22%7D&time=1389254400000%2C1389513600000&f=json/), JSON.stringify({
      href: WithTimeTimeOptions
    }));

    layer.once('load', function () {
      expect(layer._currentImage._url).to.equal(WithTimeTimeOptions);
      done();
    });

    layer.setTimeRange(new Date('January 9 2014 GMT-0800'), new Date('January 12 2014 GMT-0800'));
    expect(layer.getTimeRange()).to.deep.equal([new Date('January 9 2014 GMT-0800'), new Date('January 12 2014 GMT-0800')]);
    layer.setTimeOptions({ foo: 'bar' });
    expect(layer.getTimeOptions()).to.deep.equal({ foo: 'bar' });
    layer.addTo(map);
    server.respond();
  });

  it('should get and set a JSON layer definition', function (done) {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png32&transparent=true&bboxSR=3857&imageSR=3857&layerDefs=%7B%221%22%3A%22Foo%3DBar%22%7D&f=json/), JSON.stringify({
      href: WithDefs
    }));

    layer.once('load', function () {
      expect(layer._currentImage._url).to.equal(WithDefs);
      done();
    });

    layer.setLayerDefs({ 1: 'Foo=Bar' });
    expect(layer.getLayerDefs()).to.deep.equal({ 1: 'Foo=Bar' });

    layer.addTo(map);
    server.respond();
  });

  it('should get and set a string layer definition', function (done) {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png32&transparent=true&bboxSR=3857&imageSR=3857&layerDefs=Foo%3DBar&f=json/), JSON.stringify({
      href: WithDefs
    }));

    layer.once('load', function () {
      expect(layer._currentImage._url).to.equal(WithDefs);
      done();
    });

    layer.setLayerDefs('Foo=Bar');
    expect(layer.getLayerDefs()).to.equal('Foo=Bar');

    layer.addTo(map);
    server.respond();
  });

  it('should pass a token if one is set', function (done) {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png32&transparent=true&bboxSR=3857&imageSR=3857&token=foo&f=json/), JSON.stringify({
      href: WithToken
    }));

    layer.once('load', function () {
      expect(layer._currentImage._url).to.equal(WithToken);
      done();
    });

    layer.authenticate('foo');
    layer.addTo(map);
    server.respond();
  });

  it('should be able to request an image directly from the export service', function () {
    layer = L.esri.dynamicMapLayer({
      url: url,
      f: 'image'
    });
    var spy = sinon.spy(layer, '_renderImage');
    layer.addTo(map);
    expect(spy.getCall(0).args[0]).to.match(new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png32&transparent=true&bboxSR=3857&imageSR=3857&f=image/));
  });

  it('should be able to request an image directly from the export service, with auth', function () {
    layer = L.esri.dynamicMapLayer({
      url: url,
      f: 'image'
    });
    var spy = sinon.spy(layer, '_renderImage');
    layer.authenticate('foo');
    layer.addTo(map);
    expect(spy.getCall(0).args[0]).to.match(new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png32&transparent=true&bboxSR=3857&imageSR=3857&token=foo&f=image/));
  });

  it('should be able to request an image directly from the export service, with passing a token', function () {
    layer = L.esri.dynamicMapLayer({
      url: url,
      f: 'image',
      token: 'foo'
    });
    var spy = sinon.spy(layer, '_renderImage');
    // layer.authenticate('foo');
    layer.addTo(map);
    expect(spy.getCall(0).args[0]).to.match(new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png32&transparent=true&bboxSR=3857&imageSR=3857&token=foo&f=image/));
  });

  it('should be able to request json using a proxy', function () {
    var imageUrl = 'http://services.arcgis.com/mock/arcgis/rest/directories/arcgisoutput/Census_MapServer/_ags_mapec70f175eca3415a97c0db6779ad9976.png';
    server.respondWith('GET', new RegExp(/\.\/proxy.ashx\?http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png32&transparent=true&bboxSR=3857&imageSR=3857&proxy=\.%2Fproxy.ashx&f=json/), JSON.stringify({
      href: imageUrl,
      height: 421,
      width: 1675,
      scale: 18055.95482153688
    }));

    layer = L.esri.dynamicMapLayer({
      url: url,
      f: 'json',
      proxy: './proxy.ashx'
    });
    var spy = sinon.spy(layer, '_renderImage');

    layer.addTo(map);
    server.respond();
    expect(spy.getCall(0).args[0]).to.equal('./proxy.ashx?' + imageUrl);
  });

  it('should be able to request image using a proxy', function () {
    server.respondWith('GET', new RegExp(/\.\/proxy.ashx\?http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png32&transparent=true&bboxSR=3857&imageSR=3857&f=json/), JSON.stringify({
      imageData: base64Image,
      contentType: 'image/png'
    }));
    layer = L.esri.dynamicMapLayer({
      url: url,
      f: 'image',
      proxy: './proxy.ashx'
    });
    var spy = sinon.spy(layer, '_renderImage');
    layer.addTo(map);
    expect(spy.getCall(0).args[0]).to.match(new RegExp(/\.\/proxy.ashx\?http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png32&transparent=true&bboxSR=3857&imageSR=3857&proxy=\.%2Fproxy.ashx&f=image/));
  });

  it('should be able to parse real base64 images from the export service', function (done) {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png32&transparent=true&bboxSR=3857&imageSR=3857&f=json/), JSON.stringify({
      imageData: base64Image,
      contentType: 'image/png'
    }));

    layer.once('load', function () {
      expect(layer._currentImage._url).to.equal(Image1);
      done();
    });

    layer.addTo(map);
    server.respond();
  });

  it('should bind a popup to the layer', function () {
    /* sample unencoded/encoded geometry parameters
    {"x":-102.919921875,"y":36.66841891894786,"spatialReference":{"wkid":4326}}
    %7B%22x%22%3A-102.919921875%2C%22y%22%3A36.66841891894786%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D
    */
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/identify\?sr=4326&layers=visible&tolerance=3&returnGeometry=true&imageDisplay=500%2C500%2C96&mapExtent=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&geometry=%7B%22x%22%3A-?\d+\.\d+%2C%22y%22%3A-?\d+\.\d+%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D+&geometryType=esriGeometryPoint&maxAllowableOffset=0.000171661376953125&f=json/), JSON.stringify(sampleResponse));

    layer.bindPopup(function (error, featureCollection) {
      return featureCollection.features.length + ' Feature(s)';
    });

    layer.addTo(map);

    map.fire('click', {
      latlng: map.getCenter()
    });

    server.respond();

    clock.tick(301);

    expect(layer._popup.getContent()).to.equal('1 Feature(s)');
    expect(layer._popup.getLatLng()).to.equal(map.getCenter());
  });

  it('should bind a popup to the layer if the layer is already on a map', function () {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/identify\?sr=4326&layers=visible&tolerance=3&returnGeometry=true&imageDisplay=500%2C500%2C96&mapExtent=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&geometry=.+&geometryType=esriGeometryPoint&maxAllowableOffset=0.000171661376953125&f=json/), JSON.stringify(sampleResponse));

    layer.addTo(map);

    layer.bindPopup(function (error, featureCollection) {
      return featureCollection.features.length + ' Feature(s)';
    });

    map.fire('click', {
      latlng: map.getCenter()
    });

    server.respond();

    clock.tick(301);

    expect(layer._popup.getContent()).to.equal('1 Feature(s)');
    expect(layer._popup.getLatLng()).to.equal(map.getCenter());
  });

  it('should unbind a popup from the layer', function () {
    var spy = sinon.spy(map, 'off');
    layer.addTo(map);
    layer.bindPopup(function (error, featureCollection) {
      return featureCollection.features.length + ' Feature(s)';
    });

    layer.unbindPopup();

    expect(layer._popup).to.equal(false);
    expect(spy).to.have.been.calledWith('click', layer._getPopupData, layer);
    expect(spy).to.have.been.calledWith('dblclick', layer._resetPopupState, layer);
  });

  it('should unbind the popup events when the layer is removed', function () {
    var spy = sinon.spy(map, 'off');

    layer.addTo(map);

    layer.bindPopup(function (error, featureCollection) {
      return featureCollection.features.length + ' Feature(s)';
    });

    map.removeLayer(layer);

    expect(spy).to.have.been.calledWith('click', layer._getPopupData, layer);
    expect(spy).to.have.been.calledWith('dblclick', layer._resetPopupState, layer);
  });

  it('should use custom identify behavior if specified in popup options', function () {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/identify\?sr=4326&layers=all%3A0&tolerance=5&returnGeometry=false&layerDefs=0%3Afoo%3D%22bar%22&imageDisplay=500%2C500%2C96&mapExtent=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&geometry=%7B%22x%22%3A-?\d+\.\d+%2C%22y%22%3A-?\d+\.\d+%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D+&geometryType=esriGeometryPoint&maxAllowableOffset=0.000171661376953125&f=json/), JSON.stringify(sampleResponse));

    layer.bindPopup(function (error, featureCollection) {
      return featureCollection.features.length + ' Feature(s)';
    });

    var customIdentify = L.esri.identifyFeatures({ url: url })
      .layers('all:0')
      .layerDef(0, 'foo="bar"')
      .tolerance(5)
      .returnGeometry(false);

    layer.options.popup = customIdentify;
    layer.addTo(map);

    map.fire('click', {
      latlng: map.getCenter()
    });

    server.respond();

    clock.tick(301);

    expect(layer._popup.getContent()).to.equal('1 Feature(s)');
    expect(layer._popup.getLatLng()).to.equal(map.getCenter());
  });

  it('should render an image at the back if specified', function (done) {
    layer.bringToBack();
    var spy = sinon.spy(layer, 'bringToBack');
    layer.on('load', function () {
      expect(spy.callCount).to.equal(1);
      done();
    });
    layer.addTo(map);
    server.respond();
  });
});
/* eslint-enable handle-callback-err */
