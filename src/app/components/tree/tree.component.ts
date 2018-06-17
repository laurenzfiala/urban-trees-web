import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../abstract.component';
import {ActivatedRoute} from '@angular/router';
import {TreeService} from '../../services/tree.service';
import {Tree} from '../../entities/tree.entity';
import {BeaconData} from '../../entities/beacon-data.entity';
import {BeaconFrontend} from '../../entities/beacon-frontend.entity';

@Component({
  selector: 'ut-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.less']
})
export class TreeComponent extends AbstractComponent implements OnInit {

  private static PATH_PARAMS_TREE_ID = 'treeId';

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  public tree: Tree;

  single: any[];
  multi: any[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = false;
  xAxisLabel = 'Time';
  showYAxisLabel = false;
  yAxisLabel = '°C';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C']
  };

  // line, area
  autoScale = true;

  public data: any = [
    {
      'name': 'Germany',
      'series': [
        {
          'name': 'date',
          'value': 7300000
        },
        {
          'name': '2011',
          'value': 8940000
        }
      ]
    },

    {
      'name': 'USA',
      'series': [
        {
          'name': '2010',
          'value': 7870000
        },
        {
          'name': '2011',
          'value': 8270000
        }
      ]
    },

    {
      'name': 'France',
      'series': [
        {
          'name': '2010',
          'value': 5000002
        },
        {
          'name': '2011',
          'value': 5800000
        }
      ]
    }
  ];

  constructor(private route: ActivatedRoute,
              private treeService: TreeService) {
    super();
  }

  public ngOnInit(): void {

    this.setStatus(StatusKey.TREE_VALIDATION, StatusValue.PENDING);

    this.route.params.subscribe((params: any) => {

      const treeIdVal = Number(params[TreeComponent.PATH_PARAMS_TREE_ID]);

      if (!isNaN(treeIdVal) && treeIdVal) {
        this.setStatus(StatusKey.TREE_VALIDATION, StatusValue.SUCCESSFUL);
        this.loadTree(treeIdVal);
      } else {
        this.setStatus(StatusKey.TREE_VALIDATION, StatusValue.FAILED);
      }

    });

  }

  private loadTree(treeId: number): void {

    this.setStatus(StatusKey.TREE_LOADING, StatusValue.IN_PROGRESS);
    this.treeService.loadTree(treeId, (tree: Tree) => {
      this.tree = tree;
      this.setStatus(StatusKey.TREE_LOADING, StatusValue.SUCCESSFUL);

      if (tree.beacons) {
        this.loadBeaconData(tree.beacons);
      }
    }, (error, apiError) => {
      this.setStatus(StatusKey.TREE_LOADING, StatusValue.FAILED);
    });

  }

  private loadBeaconData(beacons: Array<BeaconFrontend>): void {

    for (let beacon of beacons) {

      this.setStatus(StatusKey.BEACON_DATA, 0);
      this.treeService.loadBeaconData(beacon.id, (beaconData: Array<BeaconData>) => {
        beacon.datasets = beaconData;
        beacon.populateChartData();
        this.setStatus(StatusKey.BEACON_DATA, this.getStatus(StatusKey.BEACON_DATA) + 1);
      }, (error, apiError) => {
        this.setStatus(StatusKey.BEACON_DATA, StatusValue.FAILED);
      });

    }

  }

}

export enum StatusKey {

  TREE_VALIDATION,
  TREE_LOADING,
  BEACON_DATA

}

export enum StatusValue {

  PENDING,
  IN_PROGRESS,
  SUCCESSFUL,
  FAILED = -1

}
