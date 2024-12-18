import { ref, nextTick } from "vue";
import {
  createGoodsSkusCard,
  updateGoodsSkusCard,
  deleteGoodsSkusCard,
  sortGoodsSkusCard,
  createGoodsSkusCardValue,
  updateGoodsSkusCardValue,
  deleteGoodsSkusCardValue,
} from "~/api/goods";
import { myNotification, useArrayUp, useArrayDown } from "./util";

export const goods_id = ref(0);

// 规格项列表
export const sku_card_list = ref([]);

// 初始化规格选项列表
/**
 * 初始化SKU卡片列表
 * 该函数用于处理和初始化商品SKU卡片的数据
 * 主要功能包括：为每个卡片设置文本和加载状态，并为其属性值设置文本
 *
 * @param {Object[]} data - 包含商品SKU卡片信息的数据对象
 *   - data.goodsSkusCard: 商品SKU卡片的数组
 */
export function initSkuCardList(data) {
  // 遍历商品SKU卡片数组，进行数据处理和初始化
  sku_card_list.value = data.goodsSkusCard.map((item) => {
    // 设置卡片的文本为其名称
    item.text = item.name;
    // 初始化加载状态为false
    item.loading = false;
    // 遍历卡片的属性值，为每个属性值设置文本
    item.goodsSkusCardValue.map((o) => {
      // 设置属性值的文本，如果为空则默认为"属性值"
      o.text = o.value || "属性值";
      return o;
    });

    return item;
  });
}

// 初始化规格的值
/**
 * 初始化SKU卡片项
 * 该函数根据给定的ID查找并返回对应的SKU卡片项
 * 主要用于在特定组件或情境中展示指定的SKU信息
 *
 * @param {string} id - SKU卡片的唯一标识符
 * @returns {Object} 包含找到的SKU卡片对象的对象
 */
export function initSkuCardItem(id) {
  // 从sku_card_list列表中查找与给定ID匹配的项
  const item = sku_card_list.value.find((item) => item.id == id);
  const loading = ref(false);
  const inputValue = ref("");
  const inputVisible = ref(false);
  const InputRef = ref();
  const handleClose = (tag) => {
    loading.value = true;
    deleteGoodsSkusCardValue(tag.id)
      .then(() => {
        myNotification(`删除规格值: ${tag.value} 成功`);
        let i = item.goodsSkusCardValue.findIndex((o) => o.id === tag.id);
        if (i != -1) {
          item.goodsSkusCardValue.splice(i, 1);
        }
      })
      .finally(() => (loading.value = false));
  };

  const showInput = () => {
    inputVisible.value = true;
    nextTick(() => {
      InputRef.value.input.focus();
    });
  };

  const handleInputConfirm = () => {
    if (!inputValue.value) {
      inputVisible.value = false;
      return;
    } else {
      loading.value = true;
      createGoodsSkusCardValue({
        goods_skus_card_id: id,
        name: item.name,
        order: 50,
        value: inputValue.value,
      })
        .then((res) => {
          myNotification("添加成功");
          item.goodsSkusCardValue.push({
            ...res,
            text: res.value,
          });
        })
        .finally(() => {
          loading.value = false;
          inputVisible.value = false;
          inputValue.value = "";
        });
    }
  };

  const handleChange = (value, tag) => {
    loading.value = true;
    updateGoodsSkusCardValue(tag.id, {
      goods_skus_card_id: id,
      name: tag.name,
      order: tag.order,
      value: value,
    })
      .then(() => {
        tag.value = value;
        myNotification("修改成功");
      })
      .catch(() => (tag.text = tag.value))
      .finally(() => {
        loading.value = false;
      });
  };

  return {
    item,
    inputValue,
    inputVisible,
    InputRef,
    handleClose,
    showInput,
    handleInputConfirm,
    loading,
    handleChange,
  };
}

// loading状态
export const btnLoading = ref(false);
// 添加规格选项
export function add_sku_card() {
  btnLoading.value = true;
  createGoodsSkusCard({
    goods_id: goods_id.value,
    name: "规格选项",
    order: 50,
    type: 0,
  })
    .then((res) => {
      sku_card_list.value.push({
        ...res,
        text: res.name,
        loading: false,
        goodsSkusCardValue: [],
      });
    })
    .finally(() => (btnLoading.value = false));
}

// 修改规格选项
export function edit_sku_card(item) {
  item.loading = true;
  updateGoodsSkusCard(item.id, {
    goods_id: item.goods_id,
    name: item.text,
    order: item.order,
    type: 0,
  })
    .then((res) => {
      myNotification("修改规格选项成功");
      item.name = item.text;
    })
    .catch((err) => {
      myNotification(err.message, "error");
      item.text = item.name;
    })
    .finally(() => (item.loading = false));
}

// 删除规格选项
export function delete_sku_card(item) {
  item.loading = true;
  deleteGoodsSkusCard(item.id)
    .then(() => {
      myNotification("删除规格选项成功");
      sku_card_list.value.splice(sku_card_list.value.indexOf(item), 1);
    })
    .catch((err) => {
      myNotification(err.message, "error");
    })
    .finally(() => (item.loading = false));
}

export const bodyLoading = ref(false);
// 排序规格选项
export function sort_sku_card(action, index) {
  let all_list = JSON.parse(JSON.stringify(sku_card_list.value));

  let func = action == "up" ? useArrayUp : useArrayDown;

  func(all_list, index);

  let sortedData = all_list.map((o, i) => {
    return {
      id: o.id,
      order: i + 1,
    };
  });

  bodyLoading.value = true;
  sortGoodsSkusCard({
    sortdata: sortedData,
  })
    .then((res) => {
      func(sku_card_list.value, index);
      myNotification("规格选项排序已上传");
    })
    .catch((err) => {
      myNotification(err.message, "error");
    })
    .finally(() => (bodyLoading.value = false));
}
