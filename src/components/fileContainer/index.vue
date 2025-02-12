<template>
  <div id="fileContainer">
    <el-image class="image" fit="contain" :src="'/api/document/download/' + file.id"
              v-if="constants.imageType.indexOf(getFileSuffix(file.originalDocumentName)) !== -1"
              @click="downloadFile('/api/document/download/' + file.id,file.originalDocumentName)"></el-image>
    <div class="file" @click="downloadFile('/api/document/download/' + file.id,file.originalDocumentName)" v-else>
      <svg-icon class="fileIcon"
                :icon-class="constants.fileTypeIconDict[getFileSuffix(file.originalDocumentName)]"
                v-if="!isEmpty(constants.fileTypeIconDict[getFileSuffix(file.originalDocumentName)])"></svg-icon>
      <svg-icon class="fileIcon" icon-class="unknownFile" v-else></svg-icon>
      <div class="fileName">{{ file.originalDocumentName }}</div>
    </div>
  </div>
</template>

<script>
import SvgIcon from "@/components/svgIcon/index.vue";
import {isEmpty} from "@/utils/common";

export default {
  name: "FileContainer",
  components: {SvgIcon},
  props: {
    file: Object
  },
  data() {
    return {
      constants: {
        imageType: ['jpg', 'png'],
        fileTypeIconDict: {
          'pdf': 'pdf',
          'doc': 'word',
          'docx': 'word',
          'txt': 'txt',
        }
      }
    }
  },
  methods: {
    downloadFile(url, name) {
      const xhr = new XMLHttpRequest();
      xhr.open("get", url);
      xhr.responseType = "blob";
      xhr.onload = (e) => {
        if (xhr.status === 200) {
          const response = xhr.response;
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(response, name);
          } else {
            const href = URL.createObjectURL(response);
            let ele = document.createElement("a");
            ele.target = "_blank";
            ele.href = href;
            ele.download = name;
            ele.click();
            ele = null;
            URL.revokeObjectURL(href);
          }
        } else {
          this.$message.error("下载失败");
        }
      };
      xhr.send(null);
    },
    getFileSuffix(fileName) {
      return fileName.substring(fileName.lastIndexOf('.') + 1)
    },

    isEmpty
  },
}
</script>

<style scoped>

#fileContainer {
  margin: 5px 0 5px 0;
}

#fileContainer .image {
  width: 50px;
  height: 50px;

  border: 1px solid #DCDCDC;
  border-radius: 8px;

  cursor: pointer;
}

#fileContainer .file {
  display: inline-flex;

  flex-flow: row;

  width: 180px;
  height: 50px;

  border: 1px solid #DCDCDC;
  border-radius: 8px;

  cursor: pointer;
}

#fileContainer .fileIcon {
  margin: 5px 0 5px 5px;

  width: 40px;
  height: 40px;
}

#fileContainer .fileName {
  flex: 1;

  line-height: 50px;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>