export const CardDef: ComponentDefinition = {
    type: 'card',
    name: 'Card',
    capabilities: {
        canHaveChildren: 3,
        canAcceptStyles: true
    },
    properties: [
        { name: 'title', type: 'text', defaultValue: 'Untitled' }
    ],
    styleSettings: {
        allowedProperties: ['background-color', 'padding']
    },
    renderTemplate: (properties: any) => `<div class="card">${properties.title}</div>`
}

export const CardComponent: ComponentInstance = {
  id: 'card-123',
  type: 'card',
  properties: {
    title: 'Welcome Card'  // Actual title value
  },
  styles: {
    'background-color': '#ffffff',
    'padding': '20px'
  },
  childrenIds: ['button-456', 'text-789'],
  meta: {
    visible: true,
    createdAt: '2023-05-20T10:00:00Z',
    updatedAt: '2023-05-20T10:00:00Z',
  }
}

const componentLibrary: ComponentLibrary = {
  definitions: {
    // Advanced Dashboard Component
    'dashboard': {
      type: 'dashboard',
      name: 'Dashboard',
      category: 'Layout',
      icon: '📊',
      capabilities: {
        canHaveChildren: 12, // Max 12 widgets
        childrenLocked: false,
        canAcceptStyles: true,
        isContainer: true
      },
      styleSettings: {
        allowedProperties: [
          'grid-template-columns', 
          'grid-gap',
          'background-color',
          'padding'
        ],
        defaultStyles: {
          display: 'grid',
          'grid-template-columns': 'repeat(3, 1fr)',
          'grid-gap': '20px',
          'padding': '24px'
        }
      },
      acceptsChildrenTypes: ['chart', 'stat-card', 'data-table'],
      renderTemplate: `
        <div class="dashboard" data-component-id="{{id}}">
          {{#children}}<!-- Widgets will be inserted here -->{{/children}}
        </div>
      `,
      script: `
        // Responsive grid adjustment
        function adjustGrid() {
          const dashboard = document.querySelector('[data-component-id="{{id}}"]');
          if (window.innerWidth < 768) {
            dashboard.style.gridTemplateColumns = '1fr';
          } else if (window.innerWidth < 1200) {
            dashboard.style.gridTemplateColumns = 'repeat(2, 1fr)';
          }
        }
        window.addEventListener('resize', adjustGrid);
        adjustGrid();
      `
    },

    // Interactive Chart Widget
    'chart': {
      type: 'chart',
      name: 'Chart Widget',
      category: 'Visualization',
      icon: '📈',
      capabilities: {
        canHaveChildren: false,
        canAcceptStyles: true
      },
      properties: [
        {
          name: 'chartType',
          type: 'select',
          defaultValue: 'line',
          options: ['line', 'bar', 'pie', 'doughnut'],
          required: true,
          group: 'Data'
        },
        {
          name: 'dataUrl',
          type: 'url',
          defaultValue: '',
          required: false,
          group: 'Data'
        },
        {
          name: 'refreshInterval',
          type: 'number',
          defaultValue: 0,
          required: false,
          group: 'Behavior'
        },
        {
          name: 'showLegend',
          type: 'boolean',
          defaultValue: true,
          required: false,
          group: 'Display'
        }
      ],
      subElements: [
        {
          key: 'title',
          selector: '.chart-title',
          name: 'Chart Title',
          canAcceptStyles: true,
          allowedStyles: ['font-size', 'color', 'text-align'],
          editableProperties: [
            {
              name: 'text',
              type: 'text',
              defaultValue: 'Performance Metrics',
              required: true
            }
          ],
          locked: true
        },
        {
          key: 'tooltip',
          selector: '.chart-tooltip',
          name: 'Tooltip',
          canAcceptStyles: true,
          allowedStyles: ['background-color', 'color', 'font-size'],
          locked: false
        }
      ],
      styleSettings: {
        allowedProperties: ['width', 'height', 'border-radius'],
        defaultStyles: {
          'background-color': '#ffffff',
          'border-radius': '8px',
          'box-shadow': '0 2px 8px rgba(0,0,0,0.1)'
        }
      },
      renderTemplate: `
        <div class="chart-widget" data-component-id="{{id}}">
          <h3 class="chart-title">{{title.properties.text}}</h3>
          <div class="chart-container">
            <canvas id="chart-{{id}}"></canvas>
          </div>
          <div class="chart-tooltip"></div>
        </div>
      `,
      script: `
        // Chart initialization and data fetching logic would go here
        // Would use properties.chartType and properties.dataUrl
      `
    },

    // Data Table Component
    'data-table': {
      type: 'data-table',
      name: 'Data Table',
      category: 'Data',
      icon: '📋',
      capabilities: {
        canHaveChildren: false,
        canAcceptStyles: false
      },
      properties: [
        {
          name: 'columns',
          type: 'text', // JSON string
          defaultValue: '["Name", "Value", "Trend"]',
          required: true
        },
        {
          name: 'paginated',
          type: 'boolean',
          defaultValue: true,
          required: false
        },
        {
          name: 'pageSize',
          type: 'number',
          defaultValue: 10,
          required: false
        }
      ],
      subElements: [
        {
          key: 'header',
          selector: 'thead',
          name: 'Table Header',
          canAcceptStyles: true,
          allowedStyles: ['background-color', 'font-weight'],
          locked: true
        },
        {
          key: 'rows',
          selector: 'tbody tr',
          name: 'Table Rows',
          canAcceptStyles: true,
          allowedStyles: ['border-bottom'],
          locked: false
        }
      ],
      renderTemplate: `
        <div class="table-container" data-component-id="{{id}}">
          <table>
            <thead>
              <tr>
                {{#each columns}}
                  <th>{{this}}</th>
                {{/each}}
              </tr>
            </thead>
            <tbody>
              <!-- Data rows would be inserted here -->
            </tbody>
          </table>
        </div>
      `
    }
  },
  instances: {},
  rootInstanceIds: []
};

const projectComponents: ComponentLibrary = {
  ...componentLibrary,
  instances: {
    // Dashboard Instance
    'dashboard-1': {
      id: 'dashboard-1',
      type: 'dashboard',
      // parentId: null,
      childrenIds: ['chart-1', 'chart-2', 'table-1'],
      properties: {},
      styles: {
        'grid-template-columns': 'repeat(4, 1fr)',
        'background-color': '#f8f9fa'
      },
      customAttributes: {
        'data-theme': 'light'
      },
      subElements: {},
      meta: {
        visible: true,
        locked: false,
        createdAt: '2023-05-20T09:00:00Z',
        updatedAt: '2023-05-20T10:30:00Z',
        createdBy: 'user-123'
      }
    },

    // First Chart Instance
    'chart-1': {
      id: 'chart-1',
      type: 'chart',
      parentId: 'dashboard-1',
      childrenIds: [],
      properties: {
        chartType: 'line',
        dataUrl: '/api/metrics/quarterly',
        refreshInterval: 300,
        showLegend: true
      },
      styles: {
        'height': '400px'
      },
      subElements: {
        title: {
          properties: {
            text: 'Quarterly Performance'
          },
          styles: {
            'font-size': '18px',
            'color': '#2c3e50'
          }
        },
        tooltip: {
          styles: {
            'background-color': '#2c3e50',
            'color': '#ffffff'
          }
        }
      },
      meta: {
        visible: true,
        locked: false,
        createdAt: '2023-05-20T09:15:00Z',
        updatedAt: '2023-05-20T10:15:00Z'
      }
    },

    // Second Chart Instance
    'chart-2': {
      id: 'chart-2',
      type: 'chart',
      parentId: 'dashboard-1',
      childrenIds: [],
      properties: {
        chartType: 'pie',
        dataUrl: '/api/metrics/breakdown',
        refreshInterval: 0,
        showLegend: false
      },
      styles: {
        'height': '300px'
      },
      subElements: {
        title: {
          properties: {
            text: 'Revenue Breakdown'
          },
          styles: {
            'font-size': '16px',
            'text-align': 'center'
          }
        }
      },
      meta: {
        visible: true,
        locked: true, // Locked from editing
        createdAt: '2023-05-20T09:30:00Z',
        updatedAt: '2023-05-20T09:30:00Z',
      }
    },

    // Data Table Instance
    'table-1': {
      id: 'table-1',
      type: 'data-table',
      parentId: 'dashboard-1',
      childrenIds: [],
      properties: {
        columns: '["Product", "Q1 Sales", "Q2 Sales", "Growth"]',
        paginated: true,
        pageSize: 5
      },
      subElements: {
        header: {
          styles: {
            'background-color': '#f1f5f9',
            'font-weight': '600'
          }
        },
        rows: {
          styles: {
            'border-bottom': '1px solid #e2e8f0'
          }
        }
      },
      meta: {
        visible: true,
        updatedAt: '2023-05-20T10:00:00Z',
        createdAt: '2023-05-20T10:00:00Z',
      },
      styles: {}
    }
  },
  rootInstanceIds: ['dashboard-1']
};