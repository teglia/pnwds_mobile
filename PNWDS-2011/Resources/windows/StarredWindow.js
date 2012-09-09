/**
 * This file is part of DrupalCon Mobile.
 *
 * DrupalCon Mobile is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DrupalCon Mobile is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DrupalCon Mobile.  If not, see <http://www.gnu.org/licenses/>.
 */

(function() {

  DrupalCon.ui.createStarredWindow = function(tabGroup) {
    var starredWindow = Titanium.UI.createWindow({
      id: 'starredWindow',
      title: 'Starred',
      backgroundColor: '#FFF',
      tabGroup: tabGroup
    });

    starredWindow.add(Titanium.UI.createLabel({
      text: 'Starred items go here',
      height: 50,
      width: 300,
      color: '#FFF',
      backgroundColor: '#000',
      top: 10,
      textAlign:' left',
      font: {fontSize: 18}
    }));

    return starredWindow;
  };

})();
