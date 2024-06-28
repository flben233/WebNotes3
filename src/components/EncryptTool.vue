<script>
import Title from "@/components/Title.vue";
import {THEME_COLOR} from "@/common/final";

export default {
  name: "EncryptTool",
  components: {Title},
  props: ['modelValue'],
  emits: ['update:modelValue'],
  data() {
    return {
      showDecryptModal: false,
      showEncryptModal: false,
      error: false,
      password: '',
      text: '',
      title: '',
      prefix: "[[Encrypted]]",
      themeColor: THEME_COLOR
    }
  },
  methods: {
    async getKey(password, salt) {
      let enc = new TextEncoder();
      let material = await window.crypto.subtle.importKey(
          "raw",
          enc.encode(password),
          { name: "PBKDF2" },
          false,
          ["deriveKey"]
      );
      return window.crypto.subtle.deriveKey(
          {
            "name": "PBKDF2",
            salt: salt,
            "iterations": 100000,
            "hash": "SHA-256"
          },
          material,
          { "name": "AES-GCM", "length": 256 },
          true,
          ["encrypt", "decrypt"]
      );
    },
    bytesToBase64(bytes) {
      return window.btoa(new Uint8Array(bytes).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    },
    base64ToBytes(base64) {
      return new Uint8Array(window.atob(base64).split('').map(char => char.charCodeAt(0)));
    },
    partText() {
      let titleIndex = this.modelValue.indexOf("\n");
      this.text = this.modelValue.substring(titleIndex + 1);
      this.title = this.modelValue.substring(0, titleIndex);
    },
    useEncrypt() {
      this.password = "";
      if (this.modelValue) {
        this.partText();
        this.showEncryptModal = true;
      }
    },
    // 该方法需要使用this.$nextTick()调用
    useDecrypt() {
      this.password = "";
      this.error = false;
      this.partText();
      if (this.text.substring(0, this.prefix.length) === this.prefix) {
        this.text = this.text.substring(this.prefix.length);
        this.showDecryptModal = true;
      } else {
        this.$emit("update:modelValue", this.modelValue);
      }
    },
    async decrypt() {
      let encryptedBuffer = this.base64ToBytes(this.text);
      let salt = encryptedBuffer.slice(0, 16);
      let iv = encryptedBuffer.slice(16, 28);
      let data = encryptedBuffer.slice(28);
      let key = await this.getKey(this.password, salt);
      let decrypted;
      try {
        decrypted = await window.crypto.subtle.decrypt(
            {
              name: "AES-GCM",
              iv: iv
            },
            key,
            data
        );
      } catch (e) {
        this.error = true;
        return;
      }
      let decryptedText = new TextDecoder().decode(decrypted);
      decryptedText = decryptedText.substring(this.prefix.length);
      this.$emit("update:modelValue", this.title + "\n" + decryptedText);
      this.showDecryptModal = false;
    },
    async encrypt() {
      let enc = new TextEncoder();
      let salt = window.crypto.getRandomValues(new Uint8Array(16));
      let key = await this.getKey(this.password, salt);
      let iv = window.crypto.getRandomValues(new Uint8Array(12));
      let encrypted = await window.crypto.subtle.encrypt(
          {
            name: "AES-GCM",
            iv: iv
          },
          key,
          enc.encode(this.prefix + this.text)
      );
      let encryptedContentArray = new Uint8Array(encrypted);
      let buff = new Uint8Array(salt.byteLength + iv.byteLength + encryptedContentArray.byteLength);
      buff.set(salt, 0);
      buff.set(iv, salt.byteLength);
      buff.set(encryptedContentArray, salt.byteLength + iv.byteLength);
      this.$emit("update:modelValue", this.title + "\n" + this.prefix + this.bytesToBase64(buff));
      this.showEncryptModal = false;
    }
  }
}
</script>

<template>
  <div>
    <va-modal v-model="showDecryptModal" hide-default-actions>
      <template #header>
        <Title>解密</Title>
      </template>
      <va-input v-model="password" placeholder="请输入密码" :color="themeColor" type="password" :error="error"/>
      <template #footer>
        <va-button :color="themeColor" text-color="#ffffff" @click="decrypt" style="margin-right: 20px">
          提交
        </va-button>
        <va-button preset="secondary" :color="themeColor" @click="showDecryptModal = false;">
          关闭
        </va-button>
      </template>
    </va-modal>

    <va-modal v-model="showEncryptModal" hide-default-actions>
      <template #header>
        <Title>加密</Title>
      </template>
      <va-input v-model="password" placeholder="请输入密码" :color="themeColor" type="password"/>
      <template #footer>
        <va-button :color="themeColor" text-color="#ffffff" @click="encrypt" style="margin-right: 20px">
          提交
        </va-button>
        <va-button preset="secondary" :color="themeColor" @click="showEncryptModal = false;">
          关闭
        </va-button>
      </template>
    </va-modal>
  </div>
</template>

<style scoped>

</style>