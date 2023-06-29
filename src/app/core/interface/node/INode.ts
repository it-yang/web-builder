import { IImg } from '@core/interface/widgets/IImg';
import { QuillModule } from 'ngx-quill';
import { IChipList } from '../widgets/IChipList';
import { IText } from '../widgets/IText';
export interface IBaseNode {
  title: string;
  uuid: string;
  body?: string;
  banner?: any;
  meta?: any[];
  params: {
    pay?: {
      money: number;
    };
    require_rule?: string[];
    comment: ICommentParams;
  };
  editor?: {
    title?: any;
    height?: string;
    modules?: QuillModule;
    placeholder?: string;
    action: {
      label: string;
    };
    succes: any;
    empty?: {
      label: string;
    };
  };
  comment?: ICommentConfig;
  actions?: any[];
  bottom?: any[];
  sidebar?: any[];
}

export interface ICommentParams {
  type: string;
  id?: string;
  attributes: {
    entity_type?: string;
    field_name?: string;
    comment_body?: {
      value?: any;
      format: 'full_html' | 'plain_text';
    };
  };
  relationships: {
    comment_type?: {
      data: {
        type: string;
        id: string;
      };
    };
    entity_id?: {
      data: {
        type: string;
        id: string;
      };
    };
    uid?: {
      data: {
        type: string;
        id: string;
      };
    };
  };
}

export interface IComment {
  author: {
    img: IImg;
    id: string;
    title: string;
    subTitle: string | null;
    align: string;
  };
  time: string;
  id: string;
  content: string;
  child: IComment[] | [];
  level: number;
}

export interface ICommentItem extends IBaseNode {
  comment: ICommentConfig;
}

export interface ICommentConfig {
  actions: string[];
  title: boolean;
}

export interface IQuestion extends IBaseNode {
  topic: IChipList;
}

export interface ICase extends IBaseNode {
  date: any[];
  block: any[];
  form?: any[];
  pdf?: any;
}

export interface ICasePrams {
  transaction_level: 'general' | 'important' | 'exigence';
  case_procedure: string;
}

export interface IAdvert extends IBaseNode {
  spacer: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';
  store: {
    logo: string;
    name: string;
  };
  date: {
    start: string;
    end: string;
  };
  view: string;
  header: IHeaderMeta;
}

export interface IHeaderMeta {
  text: IText;
  meta: {
    label: string;
    value: any;
  }[];
}
