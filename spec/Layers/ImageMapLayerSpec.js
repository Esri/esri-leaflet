/* eslint-env mocha */
/* eslint-disable handle-callback-err */
describe('L.esri.ImageMapLayer', function () {
  function createMap () {
    // create container
    var container = document.createElement('div');

    // give container a width/height
    container.setAttribute('style', 'width:500px; height: 500px;');

    // add contianer to body
    document.body.appendChild(container);

    return L.map(container).setView([37.75, -122.45], 12);
  }

  var Image1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjNGODI5NzkyMjYwMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjNGODI5N0EyMjYwMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGM0Y4Mjk3NzIyNjAxMUU1QkQ4QkI2REMzRDc1RDFDRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGM0Y4Mjk3ODIyNjAxMUU1QkQ4QkI2REMzRDc1RDFDRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrtQ3ewAAAAwUExURbS0tN3d3dLS0qurq4yMjNbW1pOTk76+vqKios7OzpqamsbGxuXl5YSEhM/Pz8zMzOLy6/8AAAGBSURBVHja7Nu7cgMhDAVQIfESCuL//zYidpLOSUNIcXEBw6znrHgImiX2e4Vp3SzkF3GHDh06dOjQoUOHDh06dOjQoUOHDh06dOjQoUOH/u90LfzTI1zKId2N2uuHVUma6hGdbcrryNT7HMf0LD+Nq/d6Uuf981J0zzGX+HOJSld08V4Zvfo5PTVqvVknVY4GNeaYajJ26cZL+WjsbzJ7rr1OSlbziKrNWnNLkmtV3/rJ2Ckvm1R2a1q0gmXJpvECmcrh2EOPqpW6W6qZUq8fb5SpxY44H7uGzqFLXiv0MVLLZnWMTnw+dn/qn7E/9Bh5M/272L/nnfa8U8pydt5njzWve9XNntbXmh/VUuyEbDHyIx/S3aSVJmpiLM1jv1Mk/uiR2oo+9zvRIX2fccYlKl87sT3SHsmbTfNHrtudf3m+F5kyIs/cuV2oSx2N1x09jhcvvG7p+06BWyV06NChQ4cOHTp06NChQ4cOHTp06NChQ4cO/df6ulno6nfQ7wIMAAxMgKYG08xRAAAAAElFTkSuQmCC';
  var Image2 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDI5MjEwNkEyMjYxMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDI5MjEwNkIyMjYxMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMjkyMTA2ODIyNjExMUU1QkQ4QkI2REMzRDc1RDFDRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowMjkyMTA2OTIyNjExMUU1QkQ4QkI2REMzRDc1RDFDRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpxjvssAAAAwUExURd3d3bOzs9LS0qurq4uLi9bW1ry8vMnJyZubm5KSkoODg6SkpOPj48TExM/Pz8zMzIOgIpEAAAGeSURBVHja7NvLbsQgDAVQbGPzGuz//9tCuumqUdXSVOplpEEaoTkYjMkmif25ximebMkfxB06dOjQoUOHDh06dOjQoUOHDh06dOjQoUOHDh3639OVy80IVuUzuheym8FcRCYf0Xl20c9HRMu5fYH/kp5vdKU+Iw89pvP+uKrvPWb1Enp1vjdcpYe2cS72STZmGeTBNowmM4lRYZexvky83C3QN/QX9draaJ1SabmuznJreaaxuvCV8tTtmJ4oR+mkeax5lNltsSy5eLaUSZdfm/s5va21NW17Hh6ZUq0r/DIb2U43tTW1OBi7z2x86RFt63rptVZbeVdz8O/oH2NfK1/mFXqK39Dtfd8lM+USe99FdTTmU3ofL+k+r6z7kPO1vef8XDPK9dCJ8yKmJlFkuhhf5918/UJtqkud+7yTDDtSba47jldgq7Tt2+4qe0z0mn3yVet2xdP7i/Dn7vdVXKWuOvPM04W7tGocz+jh6srxlB7xjT/AUyV06NChQ4cOHTp06NChQ4cOHTp06NChQ4f+//R4sqVH34N+E2AAO/CAbzhay1gAAAAASUVORK5CYII=';
  var WithBandIds = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDI5MjEwNjYyMjYxMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDI5MjEwNjcyMjYxMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMjkyMTA2NDIyNjExMUU1QkQ4QkI2REMzRDc1RDFDRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowMjkyMTA2NTIyNjExMUU1QkQ4QkI2REMzRDc1RDFDRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmMIuvMAAAAwUExURaOjo7q6upubm8rKysXFxa2traioqM3NzdTU1NHR0bW1tcDAwLGxsdra2s/Pz8zMzKnue9YAAAFqSURBVHja7NvLcoUgDAbgQMiNcPD937axPe102wVjFz86A4HRT0BwJcV+LgVdTybaD+IbOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOvR/qXMEX5f9qth3BVvYOT3q7rG9rsqxOdx/WmzkLXOyHdJtTK6jNQun5dF6i+82b+QrfdCIUzpTgZozJkt7uXYa7n6PAb9SvbdX3DXGR0beRbosS+5zFiUiPHRG6vTs4pRMZKl/6P6f9ElKbZD1XES7HuVV/f8cA+3qNKRr1Gln9NZXz6GhYzXhJZqSYtLmXHn3vSJuch3Ts4+kml1ZykKVE4UuTSXynhWx9+VHdGMZi8eKNVqbV+uzXnWJ2WolVFnqwSoi3kf0ezMJs+CwvfdVC++K2naqbHdetRHvjejIXmf3nNr7+Jxfe0dfoX2V8JWBDh06dOjQoUOHDh06dOjQoUOHDh06dOjQoUOHDv2tX08mevQ/6A8BBgCthIUYpHW5BgAAAABJRU5ErkJggg==';
  var WithMosaicRule = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDE1NkNBMTMyMjYxMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDE1NkNBMTQyMjYxMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMTU2Q0ExMTIyNjExMUU1QkQ4QkI2REMzRDc1RDFDRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowMTU2Q0ExMjIyNjExMUU1QkQ4QkI2REMzRDc1RDFDRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnU+MbkAAAAwUExURZaWlqKios7OzrW1tcXFxdHR0b29vbGxscHBwcrKytbW1rm5uampqa2trc/Pz8zMzJFOko0AAAFKSURBVHja7NtJjoQwDAXQeEyc8f63LYNUva8FohffgijgSA/FmB3F9nth5bwZZb+Ib+jQoUOHDh06dOjQoUOHDh06dOjQoUOHDh06dOjQoX/XbuZcHWwRmzfHN8F5c9t1zfaUHhF5Hu46mK8p/2WSDc+HYB2Hn9F3rSLSInz1Pr2O3pn7sc5De5ci3boSd4sn9C40q6tTI++0aFiNkOM1PIYOqtq0LZZmT+jmREurzzZJF5F6caEzqcmgGEV9iouXafyQPnm1JPKg0mSKXdVwqauP4m1dKfqh9L/UXVPi2qSJjCHTtfjO+pNKm82XaG5NDsOe6Xfm+82/g7PzdKtaKMcOzbeeNSemwY/onHEPd2w+lv2djZ47ve+c7ZwaB7600KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KH/C/28GeXV/6A/AgwASyKGXME0LNgAAAAASUVORK5CYII=';
  var WithNoData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDE1NkNBMEYyMjYxMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDE1NkNBMTAyMjYxMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMTU2Q0EwRDIyNjExMUU1QkQ4QkI2REMzRDc1RDFDRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowMTU2Q0EwRTIyNjExMUU1QkQ4QkI2REMzRDc1RDFDRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pmn1mFQAAAAwUExURdHR0crKyrS0tJWVlc3NzaqqqtXV1aWlpcXFxdvb25+fn76+vrm5ua6urs/Pz8zMzE0rlwYAAAF3SURBVHja7NuxshsxCAVQkEBgpEX//7cPbdKmSKF4JnPl4goXe8Qwlqslyu8tov3NRflFPKFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFD/9MS+de60CZJ2i8sv2riU9AQvqwLezqzU6FjKVUt7ucUe658j8GUfElPDrbVdCr5aDGIu6sOEeLolnKWc81ErvROtqI9jWcdY9nR26ODcnjUtjZE8QbfmPtQjUenr9mnR0zqZs+ndZdI1Y/2Jl1HRcoNfXVVk2b79K5Gan1x1FdHr00MW15BV/TZWwnLyPZ6poq2PqexeZBW7TZsnrjSO3mfFp9mGXvpqpbrOBzNOM4srL29V1zpXST4eT5L8/S+VGLX3LWvEV0p7Qx9jYor+u9rhnnXh0+IMG2nXZdAbb1+8Ewn7ty0Wf2z5JtvZJVUM6luOev+qfrvHoj/OOjQoUOHDh06dOjQoUOHDh06dOjQoUOHDh06dOj/ub6/ueir70H/CDAAWbCDHyCP7VgAAAAASUVORK5CYII=';
  var WithNoDataArray = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDE1NkNBMEIyMjYxMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDE1NkNBMEMyMjYxMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGRkExMUM3RTIyNjAxMUU1QkQ4QkI2REMzRDc1RDFDRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowMTU2Q0EwQTIyNjExMUU1QkQ4QkI2REMzRDc1RDFDRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhRmDVYAAAAwUExURcXFxbq6uqSkpL29vc3NzcHBwba2tq6urtHR0bKyssrKypqamqmpqdXV1c/Pz8zMzGwSp8YAAAFOSURBVHja7NvJasUwDAVQyZJlWZ7+/2+r9JVCl4WXBspViONhcWwTeRNCvp8Lp/Nk0H4Q39ChQ4cOHTp06NChQ4cOHTp06NChQ4cOHTp06NChQ/8RsXd8VfXv9NDrm6mrE+n2nfL1iOzXq/B7dWeuwqSr82IW8nVmC187wt2ruX/OTdW/9+aN+rIyGxN3mYtHI6Johbd4Y5Vlw6lGDaEIumPttZRGYq0OoVGiTWEzGbUxD6ol5mtMCvv79R2lzOgiMiUnItY7t9wIEeMmNti0ExeJITfoenqzY8J11lxlrj1mOblsrlbYmnFYpWGrkN6RcZpXvCIbQU7hQRpZjePZGaG0pfkt+a6q1637Kk6mfb7dmWnZcNXX4PFMSH/urIvt8W9PWujQoUOHDh06dOjQoUOHDh06dOjQoUOHDh06dOjQf6ufJ4Me/Q/6Q4ABALYthstxpakQAAAAAElFTkSuQmCC';
  var WithNoDataInterpretation = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkZBMTFDN0MyMjYwMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkZBMTFDN0QyMjYwMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGRkExMUM3QTIyNjAxMUU1QkQ4QkI2REMzRDc1RDFDRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGRkExMUM3QjIyNjAxMUU1QkQ4QkI2REMzRDc1RDFDRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PreJ8vsAAAAwUExURbKystHR0cDAwLW1tb29vcrKysjIyLq6uq6urri4uKGhocTExMbGxqqqqs/Pz8zMzCbSCGIAAAEZSURBVHja7NtNb4MwDIBhx4nz0RTn///bOaOVduyhHZP2WoAhBx4TDBeEJL8ukqwrQ/xC3NHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0f+A7n5uIpm7nWO/pZu5WbLqYadaz++oFuXsevyxuCdb/npRr1/76M20tXU0T+2wNXWtNn1q1FNtVXOdMTjNlr1dT/3WquSuNymifUgeMnT03HIupY8yYk9ynk2iNn+3rjedpQTd4vyiR5uyqbKTHqOOfC9H0zmk9Lt/oOdtx4r7H7c/JtvqHok1aUuRVkz/PvzAzD8a/OyxZ5d9D/5M/nwseNugo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo/93fV0Zcul/0F8CDAAxmYsEaQKefgAAAABJRU5ErkJggg==';
  // var WithPixelType = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkZBMTFDNzgyMjYwMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkZBMTFDNzkyMjYwMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGRkExMUM3NjIyNjAxMUU1QkQ4QkI2REMzRDc1RDFDRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGRkExMUM3NzIyNjAxMUU1QkQ4QkI2REMzRDc1RDFDRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pj6n55wAAAAwUExURcnJydHR0aWlpbW1tcXFxcHBwdXV1by8vNra2pqamqysrM3NzbGxsbm5uc/Pz8zMzJTUK3UAAAFXSURBVHja7NtJasAwDAVQjVY83/+2VUq3bcnCTRdfxBAT8EO27CxCiNd7wbTfDFov4gs6dOjQoUOHDh06dOjQoUOHDh06dOjQoUOHDh069H+p9x+7h/T7syX3tFa2wrt/satz9k7rRkTZuGhwj2CiT541XJ3P6p3byHCz3uIyqR5WuK9Smo7qhZnL2o8m4UnuRUVamNU5hWjIoHA3GmXEHtvNrRk/moRHeojIHrPFrI2r9Oaj0qihYY1aU63Tq3A/orPXVjNRNR1qwkW21kuapy7XqFszZNIZfZGoXC2Gq6SedTBVQoXGTP1+lLmL8qn9bmRsd9nncvvu5pSX3nvBymg5DfvcumfVLybuWeecWzyXgu+bsvMM4KVelPhczf8yUg7V/+Sk/eb07fs1HW9Y6NChQ4cOHTp06NChQ4cOHTp06NChQ4cOHTp06N/p+82gV/+D/hBgAPzNhkZ0jwchAAAAAElFTkSuQmCC';
  var WithRenderingRule = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkZBMTFDNzQyMjYwMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkZBMTFDNzUyMjYwMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGM0Y4Mjk3RjIyNjAxMUU1QkQ4QkI2REMzRDc1RDFDRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGM0Y4Mjk4MDIyNjAxMUU1QkQ4QkI2REMzRDc1RDFDRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlNwcmIAAAAwUExURb29va2trcrKyrm5uc7OzqKiopubm9DQ0LW1tbKystPT08TExMDAwMLCws/Pz8zMzJixIfsAAAFASURBVHja7NvBjoQwCAZgCrS0gPX933ZxNpPsnvYyxj38JDZI1a821YuRbD8XRueTQftBfEOHDh06dOjQoUOHDh06dOjQoUOHDh06dOjQoUOHDv1XaJ2g71z5Z09trHqLzmqmtvVkVrdvtdJXx2uvqtUw36JbSiSxxfRo5H66WSx3dc5qt3MTd1/5HtpHdafelsSSFsdYZyqlt6WpSclyBkVvfOik4P15XbmNmTSltWMEjWiNekqnlkSDKh81gMzZl9+gWxuSQnNNGWXQmtVIF4mZnajGIjmSVhe7Yc1rEEdFHjXLh3Amr5rzCD5YWOrOM1YdIXmHzuZbr0/2tn2bX49AFXxXUd1p1Zq/CvuWVffXhVwZb1ro0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0P+Vfj4Z9Oh/0F8CDADZmofLM3dxUgAAAABJRU5ErkJggg==';
  var WithTime = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjNGODI5N0QyMjYwMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjNGODI5N0UyMjYwMTFFNUJEOEJCNkRDM0Q3NUQxQ0UiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGM0Y4Mjk3QjIyNjAxMUU1QkQ4QkI2REMzRDc1RDFDRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGM0Y4Mjk3QzIyNjAxMUU1QkQ4QkI2REMzRDc1RDFDRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pk/Tz9QAAAAwUExURbS0tMrKypKSkqOjo6urq87OztnZ2dTU1JmZmb29vZ2dncLCwtHR0bi4uM/Pz8zMzLWz9KMAAAGMSURBVHja7NtB0pggDAVgQgiEEML9b9to2wt0ht8uHjKoq4+HElcWj++al/NlK/EhHtChQ4cOHTp06NChQ4cOHTp06NChQ4cOHTp06ND/d11+WBdJUv6qLnQk8vgZnRKORx+R7uE53hlRjJzHbV2Il7BMprJ8+KlljKlWCxWS+7onVFfRqNMbhe7utCv7rGtEhDyPwuPWyg9uCTXu5KvOodvDh85OJHmQUxx/Tpf01nYtXAavXdswy/RHS18sZGattr6qkV/SNzdr+bLVeXKxdbOlvvuskmuhXLTbzqW5o/syLpzhdLqmTsXe7FNl6eC9zI2NXa7oIqqk5qJTdOUEyp/sjy5cZuptTrmkD9WuKdYpdXl99ZrZa6waVqYO25PHpVo38qFy68dmZHZbJaXMnsGXvdnHqjpv6c9+zop3iE5uqxzea3lun57DuLfjDkU8PSv87y7vNYlnJTohknBcqzb4vkOHDh06dOjQoUOHDh06dOjQoUOHDh06dOjQoUP/N/182cqn/0H/EmAAhleDsZtu/OkAAAAASUVORK5CYII=';
  var WithToken = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjlFRERCNzMyMjZBMTFFNUI1NTc5NjAwMkVENUQwM0IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjlFRERCNzQyMjZBMTFFNUI1NTc5NjAwMkVENUQwM0IiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyOUVEREI3MTIyNkExMUU1QjU1Nzk2MDAyRUQ1RDAzQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyOUVEREI3MjIyNkExMUU1QjU1Nzk2MDAyRUQ1RDAzQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhEp84oAAABgUExURcjIyJycnLa2tsTExL+/v7i4uJ+fn5mZmbS0tK6urqmpqbGxsaamppqamsDAwLKysrOzs6WlpcrKyqurq6Kioq2trby8vMvLy8PDw6SkpKqqqqysrKOjo8HBwbq6uszMzKcQTFcAAAEoSURBVHja7NTbboMwDIDhhHOABginAm39/m/ZsFGpmqpdQVdpfy4Qsi2+WDhR8pdLoaOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojf5iu7I9AGB6oF2MUqcpXb+W2WZ+BMcNWUNUH6km4GDuJ9IXIOXrow2W279DzoSljI+JGkbh/6NIG8g69zrqu8FSWiUxaiU2aetNdrqNVN/596Hxe9FLuqw/z1OXX7xa/er/Yy6Zfm1vuE23i/MZU4qOpS8dd9VD3uXZPenPuNj2eIz8QlV7WrvPSfy+Vk9v3xKVBnchL3ZY3H6iKk1qH04xH6J0dyte6axK7JqrWj4Vu5Qj9t/X0k90/uGnR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dE/X78LMAB6zVaMpfGcowAAAABJRU5ErkJggg==';

  var url = 'http://services.arcgis.com/mock/arcgis/rest/services/MockImageService/ImageServer';
  var layer;
  var server;
  var map;
  var clock;

  var sampleResponse = {
    objectId: 0,
    name: 'Pixel',
    value: '-17.5575',
    location: {
      x: -122.81,
      y: 45.48,
      spatialReference: {
        wkid: 4326
      }
    },
    properties: null,
    catalogItems: null,
    catalogItemVisibilities: []
  };

  beforeEach(function () {
    clock = sinon.useFakeTimers();
    server = sinon.fakeServer.create();
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&f=json/), JSON.stringify({
      href: Image1
    }));
    map = createMap();
    map.createPane('custom');
    layer = L.esri.imageMapLayer({
      pane: 'custom',
      url: url,
      f: 'json'
    });
  });

  afterEach(function () {
    clock.restore();
    server.restore();
    map = null;
    sinon.restore();
  });

  it('should have a L.esri.imageMapLayer alias', function () {
    expect(L.esri.imageMapLayer({
      url: url
    })).to.be.instanceof(L.esri.ImageMapLayer);
  });

  it('should display an attribution if one was passed', function () {
    L.esri.imageMapLayer({
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

  it('will load a new image when the map moves', function (done) {
    layer.addTo(map);

    layer.once('load', function () {
      layer.once('load', function () {
        expect(layer._currentImage._url).to.equal(Image2);
        done();
      });
      clock.tick(151);
      map.setView([37.30, -121.96], 10);
      server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&f=json/), JSON.stringify({
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

  it('should pass the pane option through to the image', function (done) {
    layer.on('load', function () {
      expect(layer._currentImage.options.pane).to.equal('custom');
      done();
    });
    layer.addTo(map);
    server.respond();
  });

  it('should expose the identify method on the underlying service', function () {
    // var spy = sinon.spy(layer.service, 'identify');
    var identify = layer.identify();
    expect(identify).to.be.an.instanceof(L.esri.IdentifyImage);
    expect(identify._service).to.equal(layer.service);
  });

  it('should bind a popup to the layer', function () {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/identify\?returnGeometry=false&geometry=%7B%22x%22%3A-?\d+.\d+%2C%22y%22%3A-?\d+.\d+%2C%22spatialReference%22%3A%7B%22wkid%22%3A\d+%7D%7D&geometryType=esriGeometryPoint&f=json/), JSON.stringify(sampleResponse));

    layer.bindPopup(function (error, results) {
      return 'Pixel value: ' + results.pixel.properties.value;
    });

    layer.addTo(map);

    map.fire('click', {
      latlng: map.getCenter()
    });

    server.respond();

    clock.tick(301);

    expect(layer._popup.getContent()).to.equal('Pixel value: -17.5575');
    expect(layer._popup.getLatLng()).to.equal(map.getCenter());
  });

  it('should bind a popup to the layer if the layer is already on a map', function () {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/identify\?returnGeometry=false&geometry=%7B%22x%22%3A-?\d+.\d+%2C%22y%22%3A-?\d+.\d+%2C%22spatialReference%22%3A%7B%22wkid%22%3A\d+%7D%7D&geometryType=esriGeometryPoint&f=json/), JSON.stringify(sampleResponse));

    layer.addTo(map);

    layer.bindPopup(function (error, results) {
      return 'Pixel value: ' + results.pixel.properties.value;
    });

    map.fire('click', {
      latlng: map.getCenter()
    });

    server.respond();

    clock.tick(301);

    expect(layer._popup.getContent()).to.equal('Pixel value: -17.5575');
    expect(layer._popup.getLatLng()).to.equal(map.getCenter());
  });

  it('should unbind a popup from the layer', function () {
    var spy = sinon.spy(map, 'off');
    layer.addTo(map);
    layer.bindPopup(function (error, results) {
      return 'Pixel value: ' + results.pixel.properties.value;
    });

    layer.unbindPopup();

    expect(layer._popup).to.equal(false);
    expect(spy).to.have.been.calledWith('click', layer._getPopupData, layer);
    expect(spy).to.have.been.calledWith('dblclick', layer._resetPopupState, layer);
  });

  it('should unbind the popup events when the layer is removed', function () {
    var spy = sinon.spy(map, 'off');

    layer.addTo(map);
    layer.bindPopup(function (error, results) {
      return 'Pixel value: ' + results.pixel.properties.value;
    });

    map.removeLayer(layer);

    expect(spy).to.have.been.calledWith('click', layer._getPopupData, layer);
    expect(spy).to.have.been.calledWith('dblclick', layer._resetPopupState, layer);
  });

  it('should bind a popup to a layer with a mosaic rule', function () {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/identify\?returnGeometry=false&geometry=%7B%22x%22%3A-?\d+.\d+%2C%22y%22%3A-?\d+.\d+%2C%22spatialReference%22%3A%7B%22wkid%22%3A\d+%7D%7D&geometryType=esriGeometryPoint&mosaicRule=%7B%22mosaicMethod%22%3A%22esriMosaicLockRaster%22%2C%22lockRasterIds%22%3A%5B8%5D%7D&f=json/), JSON.stringify(sampleResponse));

    layer.bindPopup(function (error, results) {
      return 'Pixel value: ' + results.pixel.properties.value;
    });

    layer.addTo(map);
    layer.setMosaicRule({ mosaicMethod: 'esriMosaicLockRaster', lockRasterIds: [8] });

    map.fire('click', {
      latlng: map.getCenter()
    });

    server.respond();

    clock.tick(301);

    expect(layer._popup.getContent()).to.equal('Pixel value: -17.5575');
    expect(layer._popup.getLatLng()).to.equal(map.getCenter());
  });

  it('should propagate events from the service', function (done) {
    server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockImageService/ImageServer&f=json', JSON.stringify({
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

  it('should get and set rendering rule', function (done) {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&renderingRule=%7B%22rasterFunction%22%3A%22RFTAspectColor%22%7D&f=json/), JSON.stringify({
      href: WithRenderingRule
    }));

    layer.once('load', function () {
      expect(layer._currentImage._url).to.equal(WithRenderingRule);
      done();
    });

    layer.setRenderingRule({ rasterFunction: 'RFTAspectColor' });
    expect(layer.getRenderingRule()).to.deep.equal({ rasterFunction: 'RFTAspectColor' });
    layer.addTo(map);
    server.respond();
  });

  it('should get and set mosaic rule', function (done) {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&mosaicRule=%7B%22mosaicMethod%22%3A%22esriMosaicLockRaster%22%2C%22lockRasterIds%22%3A%5B8%5D%7D&f=json/), JSON.stringify({
      href: WithMosaicRule
    }));

    layer.once('load', function () {
      expect(layer._currentImage._url).to.equal(WithMosaicRule);
      done();
    });

    layer.setMosaicRule({ mosaicMethod: 'esriMosaicLockRaster', lockRasterIds: [8] });
    expect(layer.getMosaicRule()).to.deep.equal({ mosaicMethod: 'esriMosaicLockRaster', lockRasterIds: [8] });
    layer.addTo(map);
    server.respond();
  });

  it('should get and set time ranges', function (done) {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&time=1389254400000%2C1389513600000&f=json/), JSON.stringify({
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

  it('should get and set bandIds as an array param', function (done) {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&bandIds=3%2C0%2C1&f=json/), JSON.stringify({
      href: WithBandIds
    }));

    layer.once('load', function () {
      expect(layer._currentImage._url).to.equal(WithBandIds);
      done();
    });

    layer.setBandIds([3, 0, 1]);
    expect(layer.getBandIds()).to.deep.equal('3,0,1');
    layer.addTo(map);
    server.respond();
  });

  it('should get and set bandIds as a string param', function (done) {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&bandIds=3%2C0%2C1&f=json/), JSON.stringify({
      href: WithBandIds
    }));

    layer.once('load', function () {
      expect(layer._currentImage._url).to.equal(WithBandIds);
      done();
    });

    layer.setBandIds('3,0,1');
    expect(layer.getBandIds()).to.deep.equal('3,0,1');
    layer.addTo(map);
    server.respond();
  });

  it('should get and set noData with zero passed in the constructor', function (done) {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&noData=0&f=json/), JSON.stringify({
      href: WithNoData
    }));

    var noDataLayer = L.esri.imageMapLayer({
      pane: 'custom',
      url: url,
      f: 'json',
      noData: 0
    });

    noDataLayer.once('load', function () {
      expect(noDataLayer._currentImage._url).to.equal(WithNoData);
      done();
    });

    expect(noDataLayer.getNoData()).to.equal(0);
    noDataLayer.addTo(map);
    server.respond();
  });

  it('should get and set noData as a numeric param', function (done) {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&noData=0&f=json/), JSON.stringify({
      href: WithNoData
    }));

    layer.once('load', function () {
      expect(layer._currentImage._url).to.equal(WithNoData);
      done();
    });

    layer.setNoData(0);
    expect(layer.getNoData()).to.equal('0');
    layer.addTo(map);
    server.respond();
  });

  it('should get and set noData as an array', function (done) {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&noData=58%2C128%2C187&f=json/), JSON.stringify({
      href: WithNoDataArray
    }));

    layer.once('load', function () {
      expect(layer._currentImage._url).to.equal(WithNoDataArray);
      done();
    });

    layer.setNoData([58, 128, 187]);
    expect(layer.getNoData()).to.deep.equal('58,128,187');
    layer.addTo(map);
    server.respond();
  });

  it('should get and set noDataInterpretation', function (done) {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&noData=0&noDataInterpretation=esriNoDataMatchAll&f=json/), JSON.stringify({
      href: WithNoDataInterpretation
    }));

    layer.once('load', function () {
      expect(layer._currentImage._url).to.equal(WithNoDataInterpretation);
      done();
    });

    layer.setNoData(0, 'esriNoDataMatchAll');
    expect(layer.getNoDataInterpretation()).to.equal('esriNoDataMatchAll');
    layer.addTo(map);
    server.respond();
  });

  it('should get and set pixelType', function (done) {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&pixelType=U8&f=json/), JSON.stringify({
      href: WithNoDataInterpretation
    }));

    layer.once('load', function () {
      expect(layer._currentImage._url).to.equal(WithNoDataInterpretation);
      done();
    });

    layer.setPixelType('U8');
    expect(layer.getPixelType()).to.deep.equal('U8');
    layer.addTo(map);
    server.respond();
  });

  it('should be able to request an image directly from the export service', function () {
    layer = L.esri.imageMapLayer({
      url: url,
      f: 'image'
    });
    var spy = sinon.spy(layer, '_renderImage');
    layer.addTo(map);
    expect(spy.getCall(0).args[0]).to.match(new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&f=image/));
  });

  it('should render an images at the back if specified', function (done) {
    layer.bringToBack();
    var spy = sinon.spy(layer, 'bringToBack');
    layer.on('load', function () {
      expect(spy.callCount).to.equal(1);
      done();
    });
    layer.addTo(map);
    server.respond();
  });

  it('should be able to request json using a proxy', function () {
    var imageUrl = 'http://services.arcgis.com/mock/arcgis/rest/directories/arcgisoutput/Census_MapServer/_ags_mapec70f175eca3415a97c0db6779ad9976.png';
    server.respondWith('GET', new RegExp(/\.\/proxy.ashx\?http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&f=json/), JSON.stringify({
      href: imageUrl
    }));

    layer = L.esri.imageMapLayer({
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
    server.respondWith('GET', new RegExp(/\/proxy.ashx\?http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&f=image/), JSON.stringify({
      imageData: Image1,
      contentType: 'image/png'
    }));

    layer = L.esri.imageMapLayer({
      url: url,
      f: 'image',
      proxy: './proxy.ashx'
    });
    server.respond();

    var spy = sinon.spy(layer, '_renderImage');

    layer.addTo(map);
    server.respond();
    expect(spy.getCall(0).args[0]).to.match(new RegExp(/\.\/proxy.ashx\?http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&f=image/));
  });

  it('should pass a token if one is set', function (done) {
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&token=foo&f=json/), JSON.stringify({
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

  it('should pass a token if one is set (f:image)', function () {
    layer = L.esri.imageMapLayer({
      url: url,
      f: 'image'
    });
    var spy = sinon.spy(layer, '_renderImage');
    layer.authenticate('foo');
    layer.addTo(map);
    expect(spy.getCall(0).args[0]).to.match(new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&token=foo&f=image/));
  });
});
/* eslint-enable handle-callback-err */
