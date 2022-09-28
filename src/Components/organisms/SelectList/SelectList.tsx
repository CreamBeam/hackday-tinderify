import * as React from 'react';
import Magnifier from '../../../assets/magnifier.svg';
import Edit from '../../../assets/edit.svg';
import Delete from '../../../assets/trashcan.svg';
import './SelectList.scss';
import * as Firestore from '../../../services/firebase/firestore/firestore.service';
import { onSnapshot } from 'firebase/firestore';
import { CardNav } from '../../molecules';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setSelectedList, setTagLists } from '../../../store/playlists/playlists.slice';
import { SelectedList } from '../../../store/playlists/playlists.interface';

const SelectList = () => {
  const taglists = useAppSelector(state => state.playlist.tagLists);
  const fireId = useAppSelector(state => state.user.fireId);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const unsubscribe = onSnapshot(Firestore.tagCol(fireId), collection => {
      const lists: SelectedList[] = [];

      collection.forEach(doc => {
        const data = doc.data();

        lists.push({
          name: data.name,
          color: data.color,
          tracks: data.tracks,
          spotifySync: {
            exported: data.exported,
            playlistId: data.playlistId,
            snapshotId: data.snapshotId,
          },
          //TODO: Overwrites every time this view is opened
          status: {
            sync: 'UNKNOWN', //TODO: List status could be valid and is now unknown
            exporting: false,
            error: false,
          },
        });
      });

      dispatch(setTagLists({ lists }));
    });

    return () => {
      unsubscribe();
    };
  }, [fireId, dispatch]);

  return (
    <div className="select-list">
      <CardNav title="Lists" />
      <form className="select-list__search">
        <input type="text" className="select-list__search--input" />
        <img src={Magnifier} alt="search" className="select-list__search--icon" />
      </form>
      <section className="select-list__header">
        <p className="select-list__header--title">TAGS</p>
      </section>
      <ul className="select-list__list">
        {taglists.map((list, index) => {
          return (
            <li
              onClick={() => {
                dispatch(setSelectedList({ selectedList: list }));
              }}
              key={index}
              className="select-list__row"
            >
              <section className="select-list__details">
                <div
                  className="select-list__details--circle"
                  style={{ background: list.color }}
                ></div>
                <p className="select-list__details--title">{list.name}</p>
              </section>
              <section className="select-list__options">
                <button className="select-list__edit" onClick={() => console.log('edit')}>
                  <img src={Edit} alt="edit" className="select-list__edit--icon" />
                </button>
                <button
                  className="select-list__delete"
                  onClick={() => {
                    Firestore.deleteList(fireId, list.name);
                  }}
                >
                  <img src={Delete} alt="delete" className="select-list__delete--icon" />
                </button>
              </section>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SelectList;
