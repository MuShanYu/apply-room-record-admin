const steps = [
  {
    element: '#room-list-operate-apply',
    popover: {
      title: '禁止预约',
      description: '您无法操作非负责的房间！系统会给出提示。选中下方表格中的房间可以对房间进行禁止预约操作，已经被禁止预约的房间不会显示在客户端的可预约房间列表中。已经禁止预约的房间再次进行此操作将会解除禁止预约。',
      position: 'bottom'
    }
  },
  {
    element: '#room-list-operate-ban',
    popover: {
      title: '房间禁用',
      description: '您无法操作非负责的房间！系统会给出提示。选中下方表格中的房间可以对房间禁用操作，被禁用的房间系统将不会进行后续任何的数据统计操作，如果您需要对该房间进行数据统计操作，请不要禁用相应的房间。对已经禁用的房间再次进行该操作将会恢复非禁用状态。',
      position: 'bottom'
    }
  },
  {
    element: '#room-list-select-filter',
    popover: {
      title: '列表删选条件',
      description: '在这里您可以通过改变校区、楼栋、类别来筛选您想要的数据。',
      position: 'bottom'
    }
  },
  {
    element: '#room-list-room-name',
    popover: {
      title: '按名称搜索',
      description: '您可以输入任意的房间名称关键字，输入完毕后点击回车按键或者点击右侧搜索按钮可以完成搜索。该条件为非必选条件。输入框为空时点击搜索或者回车将查看所有房间数据。',
      position: 'bottom'
    }
  },
  {
    element: '#room-list-my-charge',
    popover: {
      title: '查看我的',
      description: '默认展示为您负责的房间里列表，您可以点击眼睛图标查看所有房间，但是您仅有查看权限，不能操作非负责的房间！',
      position: 'bottom'
    }
  },
]

export default steps;
