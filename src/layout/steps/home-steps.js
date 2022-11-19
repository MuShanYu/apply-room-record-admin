const steps = [
  {
    element: '#home-select-time',
    popover: {
      title: '时间跨度选择',
      description: '在这里您可以进行时间跨度的选择，查看不同的统计数据。需注意：下方图标最多只会显示14天的数据，这是为了UI的正确展示，但这不影响您导出整体的报表数据。说明:一天是指从00:00:00~23:59:59',
      position: 'bottom'
    }
  },
  {
    element: '#home-select-room-category',
    popover: {
      title: '房间类别选择',
      description: '在这里您可以选择不同的房间类别筛选数据，请注意如果您添加了新的房间类别，那么您需要刷新当前页面才能查看到新的房间类别。该条件为非必选。',
      position: 'bottom'
    }
  },
  {
    element: '#home-search-room-name',
    popover: {
      title: '房间名称选择',
      description: '在该输入框中您可以输入任意的房间名称关键字，系统会自动匹配相关的房间名称进行选择。该条件为非必选。',
      position: 'bottom'
    }
  },
  {
    element: '#home-export-btn',
    popover: {
      title: '导出报表数据',
      description: '点击该按钮系统会展示您的数据导出筛选条件，核对无误后点击导出即可。注意：导出的数据只会包含当前所选择的条件对应的房间，不在条件中的房间将不会被统计。',
      position: 'bottom'
    }
  }
]

export default steps;
